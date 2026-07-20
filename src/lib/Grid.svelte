<script>
  import { game } from './game.svelte.js';
  import { drag, startDrag, canDropAt } from './drag.svelte.js';
  import { worker, stepMs } from './worker.svelte.js';
  import { BUILDINGS } from './buildings.js';
  import { RESOURCES } from './resources.js';
  import BuildingIcon from './BuildingIcon.svelte';
  import { flip } from 'svelte/animate';
  import { scale } from 'svelte/transition';

  const cells = Array.from({ length: 25 }, (_, i) => i);

  // Buildings as a keyed list (by uid) positioned over the grid via their cell
  // index. Keeping identity stable lets animate:flip glide them between cells.
  let placed = $derived(
    game.grid.map((b, i) => (b ? { ...b, index: i } : null)).filter(Boolean)
  );

  const isBeingDragged = (i) =>
    drag.active && drag.from?.source === 'grid' && drag.from.index === i;
</script>

<div class="grid">
  {#each cells as i}
    <div
      class="cell"
      data-cell={i}
      class:target={drag.active && drag.overIndex === i}
      class:valid={drag.active && drag.overIndex === i && canDropAt(i)}
      class:invalid={drag.active && drag.overIndex === i && !canDropAt(i)}
    >
      <div class="slot"></div>
    </div>
  {/each}

  <!-- Pieces let pointer events pass through while dragging so the cells
       underneath can be hit-tested for the drop target. -->
  <div class="pieces" class:passthrough={drag.active}>
    {#each placed as p (p.uid)}
      {@const def = BUILDINGS[p.type]}
      {@const res = def.produces ? RESOURCES[def.produces] : null}
      <div
        class="piece"
        role="button"
        tabindex="0"
        aria-label={def.name}
        class:hidden={isBeingDragged(p.index)}
        style="left:{(p.index % 5) * 20}%; top:{Math.floor(p.index / 5) * 20}%; --tint:{def.tint}"
        animate:flip={{ duration: p.uid === game.justMoved ? 0 : 240 }}
        in:scale={{ duration: 220, start: 0.4 }}
        out:scale={{ duration: 150 }}
        onpointerdown={(e) => startDrag(e, p.type, { source: 'grid', index: p.index })}
      >
        <div
          class="tile"
          data-uid={p.uid}
          class:triggered={worker.flashing.includes(p.uid)}
          class:exhausted={def.special === 'lift' && (p.stored ?? 0) === 0}
        >
          <BuildingIcon type={p.type} />

          {#if res && (p.stored ?? 0) > 0}
            <div class="badge" style="--rtint:{res.tint}" class:bump={worker.flashing.includes(p.uid)}>
              <span class="ricon">{res.icon}</span>{p.stored}
            </div>
          {:else if def.special === 'lift'}
            <div class="badge" style="--rtint:{def.tint}" class:bump={worker.flashing.includes(p.uid)}>
              <span class="ricon">{def.emoji}</span>{p.stored ?? 0}
            </div>
          {/if}

          {#if res && worker.flashing.includes(p.uid)}
            <div class="plus" style="--rtint:{res.tint}">+1</div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  {#if worker.index != null}
    <div
      class="worker"
      style="left:{(worker.index % 5) * 20}%; top:{Math.floor(worker.index / 5) * 20}%; --step:{stepMs()}ms"
      in:scale={{ duration: 180, start: 0.3 }}
      out:scale={{ duration: 180 }}
    >
      <div class="worker-inner"></div>
    </div>
  {/if}
</div>

<style>
  .grid {
    position: relative;
    width: min(90vw, 66vh, 440px);
    aspect-ratio: 1;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0)),
      rgba(0, 0, 0, 0.22);
    box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.4), 0 12px 34px rgba(0, 0, 0, 0.35);
    touch-action: none;
  }

  .cell {
    position: relative;
  }
  .slot {
    position: absolute;
    inset: 5px;
    border-radius: 13px;
    background: rgba(255, 255, 255, 0.025);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
    transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
  }
  .cell.target .slot {
    transform: scale(1.03);
  }
  .cell.valid .slot {
    background: rgba(94, 234, 212, 0.14);
    box-shadow: inset 0 0 0 2px rgba(94, 234, 212, 0.7), 0 0 22px rgba(94, 234, 212, 0.25);
  }
  .cell.invalid .slot {
    background: rgba(248, 113, 113, 0.12);
    box-shadow: inset 0 0 0 2px rgba(248, 113, 113, 0.7);
  }

  .pieces {
    position: absolute;
    inset: 0;
  }
  .pieces.passthrough {
    pointer-events: none;
  }

  .piece {
    position: absolute;
    width: 20%;
    height: 20%;
    will-change: transform;
  }
  .piece.hidden {
    opacity: 0;
  }

  .tile {
    position: absolute;
    inset: 5px;
    border-radius: 13px;
    display: grid;
    place-items: center;
    container-type: size;
    cursor: grab;
    touch-action: none;
    background: linear-gradient(
      160deg,
      color-mix(in srgb, var(--tint) 32%, transparent),
      color-mix(in srgb, var(--tint) 8%, transparent)
    );
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 0 0 0 1px color-mix(in srgb, var(--tint) 30%, transparent),
      0 6px 14px rgba(0, 0, 0, 0.35);
    transition: box-shadow 0.15s ease, transform 0.12s ease, filter 0.3s ease,
      opacity 0.3s ease;
  }
  .tile:active {
    cursor: grabbing;
    transform: scale(0.96);
  }

  /* Spent coffee: grayed out until the next run restores it. */
  .tile.exhausted {
    filter: grayscale(0.85) brightness(0.6);
    opacity: 0.5;
  }

  /* Stored-resource count, kept on the producing tile itself. */
  .badge {
    position: absolute;
    left: 50%;
    bottom: 4%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.12em;
    padding: 0.1em 0.42em 0.1em 0.28em;
    border-radius: 999px;
    font-size: 26cqmin;
    font-weight: 800;
    line-height: 1;
    color: #0f0d1c;
    font-variant-numeric: tabular-nums;
    background: color-mix(in srgb, var(--rtint) 88%, white 12%);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  .badge .ricon {
    font-size: 0.78em;
  }
  .badge.bump {
    animation: badgePop 0.38s ease;
  }
  @keyframes badgePop {
    0%,
    100% {
      transform: translateX(-50%) scale(1);
    }
    40% {
      transform: translateX(-50%) scale(1.35);
    }
  }

  /* "+1" that floats up off the tile each time it produces. */
  .plus {
    position: absolute;
    left: 50%;
    top: 16%;
    pointer-events: none;
    font-size: 32cqmin;
    font-weight: 800;
    color: color-mix(in srgb, var(--rtint) 75%, white);
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
    animation: plusFloat 0.42s ease-out forwards;
  }
  @keyframes plusFloat {
    from {
      opacity: 0;
      transform: translate(-50%, 40%) scale(0.6);
    }
    30% {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: translate(-50%, -70%) scale(1);
    }
  }

  /* Building fires when the worker steps onto it. */
  .tile.triggered {
    animation: trigger 0.38s ease;
  }
  @keyframes trigger {
    0%,
    100% {
      transform: scale(1);
    }
    35% {
      transform: scale(1.18);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18),
        0 0 24px color-mix(in srgb, var(--tint) 65%, transparent);
    }
  }

  /* The worker travelling the board during a run. */
  .worker {
    position: absolute;
    width: 20%;
    height: 20%;
    z-index: 3;
    pointer-events: none;
    transition: left var(--step) linear, top var(--step) linear;
  }
  .worker-inner {
    position: absolute;
    inset: 3px;
    display: grid;
    place-items: center;
    container-type: size;
    animation: bob 0.6s ease-in-out infinite;
  }
  .worker-inner::before {
    content: '👷';
    font-size: 46cqmin;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.55));
  }
  @keyframes bob {
    0%,
    100% {
      transform: translateY(2%);
    }
    50% {
      transform: translateY(-8%);
    }
  }
</style>
