<script>
  import { game } from './game.svelte.js';
  import { drag, startDrag, canDropAt } from './drag.svelte.js';
  import { worker, stepMs } from './worker.svelte.js';
  import { BUILDINGS } from './buildings.js';
  import { RESOURCES } from './resources.js';
  import { GRID_SIZE, CELL_COUNT, CELL_PCT, cellLeft, cellTop } from './grid.js';
  import BuildingIcon from './BuildingIcon.svelte';
  import workerImg from './assets/worker.png';
  import batteryImg from './assets/res-battery.png';
  import { flip } from 'svelte/animate';
  import { scale } from 'svelte/transition';

  const cells = Array.from({ length: CELL_COUNT }, (_, i) => i);

  // The stored-count badge a tile shows, or null if it stores nothing. Resource
  // producers (and the trade post's coins) show the resource icon; charge tiles
  // (coffee) show their own emoji and stay visible at 0. `showAtZero` keeps a
  // depleted charge tile's badge on screen.
  function badgeOf(def) {
    if (def.produces) {
      const r = RESOURCES[def.produces];
      return { icon: r.icon, image: r.image, tint: r.tint, showAtZero: false };
    }
    if (def.special) return { icon: def.emoji, image: def.badgeImage ?? null, tint: def.tint, showAtZero: true };
    return null;
  }

  // Sign a floating label: '+n' or '−n'.
  const signed = (d) => (d > 0 ? '+' : '−') + Math.abs(d);

  // Buildings as a keyed list (by uid) positioned over the grid via their cell
  // index. Keeping identity stable lets animate:flip glide them between cells.
  let placed = $derived(
    game.grid.map((b, i) => (b ? { ...b, index: i } : null)).filter(Boolean)
  );

  const isBeingDragged = (i) =>
    drag.active && drag.from?.source === 'grid' && drag.from.index === i;
</script>

<div class="grid" style="--n:{GRID_SIZE}; --cell:{CELL_PCT}%">
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
      {@const badge = badgeOf(def)}
      {@const stored = p.stored ?? 0}
      {@const fl = worker.flashes.findLast((f) => f.uid === p.uid)}
      {@const flashing = !!fl}
      <div
        class="piece"
        role="button"
        tabindex="0"
        aria-label={def.name}
        class:hidden={isBeingDragged(p.index)}
        style="left:{cellLeft(p.index)}%; top:{cellTop(p.index)}%; --tint:{def.tint}"
        animate:flip={{ duration: p.uid === game.justMoved ? 0 : 240 }}
        in:scale={{ duration: 220, start: 0.4 }}
        out:scale={{ duration: 150 }}
        onpointerdown={(e) => startDrag(e, p.type, { source: 'grid', index: p.index })}
      >
        <div
          class="tile"
          data-uid={p.uid}
          class:triggered={flashing}
          class:exhausted={def.startStored != null && stored === 0}
        >
          <BuildingIcon type={p.type} />

          {#if badge && (badge.showAtZero || stored > 0)}
            <div class="badge" style="--rtint:{badge.tint}" class:bump={flashing}>
              {#if badge.image}
                <img class="ricon-img" src={badge.image} alt="" draggable="false" />
              {:else}
                <span class="ricon">{badge.icon}</span>
              {/if}{stored}
            </div>
          {/if}
        </div>

        <!-- Float lives outside .tile so a just-spent coffee's dimming doesn't
             also fade its own label. Direction/colour follow the actual change,
             so a producer sold from by a trade post shows a red −1. -->
        {#if fl}
          <div class="plus" class:gain={fl.delta > 0} class:loss={fl.delta < 0}>{signed(fl.delta)}</div>
        {/if}
      </div>
    {/each}
  </div>

  {#if worker.index != null}
    <div
      class="worker"
      style="left:{cellLeft(worker.index)}%; top:{cellTop(worker.index)}%; --step:{stepMs()}ms"
      in:scale={{ duration: 180, start: 0.3 }}
      out:scale={{ duration: 180 }}
    >
      <div class="worker-inner"><img class="worker-img" src={workerImg} alt="" draggable="false" /></div>
      {#key worker.energy}
        <div class="energy" class:low={worker.energy <= 0}>
          <img class="energy-icon" src={batteryImg} alt="" draggable="false" />{worker.energy}
        </div>
      {/key}
    </div>
  {/if}
</div>

<style>
  .grid {
    position: relative;
    width: min(90vw, 66vh, 440px);
    aspect-ratio: 1;
    display: grid;
    grid-template-columns: repeat(var(--n), 1fr);
    grid-template-rows: repeat(var(--n), 1fr);
    border-radius: 22px;
    border: 3px solid var(--ink);
    background: var(--board);
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.18),
      0 6px 0 rgba(0, 0, 0, 0.12), 0 14px 26px rgba(0, 0, 0, 0.2);
    touch-action: none;
  }

  .cell {
    position: relative;
  }
  .slot {
    position: absolute;
    inset: 5px;
    border-radius: 13px;
    background: var(--slot);
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.45);
    transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
  }
  .cell.target .slot {
    transform: scale(1.03);
  }
  .cell.valid .slot {
    background: rgba(88, 179, 104, 0.22);
    box-shadow: inset 0 0 0 2px rgba(79, 174, 90, 0.9), 0 0 18px rgba(79, 174, 90, 0.3);
  }
  .cell.invalid .slot {
    background: rgba(229, 96, 63, 0.18);
    box-shadow: inset 0 0 0 2px rgba(229, 96, 63, 0.9);
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
    width: var(--cell);
    height: var(--cell);
    container-type: size; /* lets the .plus float size itself via cqmin */
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
    background: var(--card);
    box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--tint) 55%, var(--card)),
      0 3px 0 rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.16);
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
  .badge .ricon-img {
    width: 1.05em;
    height: 1.05em;
    object-fit: contain;
    margin: -0.15em 0;
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

  /* Floating change label. Gains rise in green; losses sink in red. */
  .plus {
    position: absolute;
    left: 50%;
    top: 38%;
    pointer-events: none;
    font-size: 32cqmin;
    font-weight: 900;
    -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.9);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
  }
  .plus.gain {
    color: #2f9e4e;
    animation: floatUp 0.42s ease-out forwards;
  }
  .plus.loss {
    color: #db3f26;
    animation: floatDown 0.42s ease-out forwards;
  }
  @keyframes floatUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(0.4em) scale(0.6);
    }
    30% {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-1.6em) scale(1);
    }
  }
  @keyframes floatDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-0.4em) scale(0.6);
    }
    30% {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(1.6em) scale(1);
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
    width: var(--cell);
    height: var(--cell);
    z-index: 3;
    pointer-events: none;
    container-type: size; /* for the energy badge's cqmin sizing */
    transition: left var(--step) linear, top var(--step) linear;
  }

  /* The worker's current energy, shown as a battery badge above its head. */
  .energy {
    position: absolute;
    top: -14%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.05em;
    padding: 0.06em 0.42em 0.06em 0.22em;
    border-radius: 999px;
    font-size: 23cqmin;
    font-weight: 800;
    line-height: 1;
    color: #1c3a20;
    font-variant-numeric: tabular-nums;
    background: color-mix(in srgb, #b7e6bd 90%, white);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.5);
    z-index: 5;
    animation: energyPop 0.3s ease;
  }
  .energy.low {
    background: color-mix(in srgb, #f0a99a 92%, white);
    color: #4a1c14;
  }
  .energy-icon {
    width: 1.05em;
    height: 1.05em;
    object-fit: contain;
    margin: -0.15em 0;
  }
  @keyframes energyPop {
    0% {
      transform: translateX(-50%) scale(1);
    }
    45% {
      transform: translateX(-50%) scale(1.18);
    }
    100% {
      transform: translateX(-50%) scale(1);
    }
  }
  .worker-inner {
    position: absolute;
    inset: 3px;
    display: grid;
    place-items: center;
    animation: bob 0.6s ease-in-out infinite;
  }
  .worker-img {
    width: 96%;
    height: 96%;
    object-fit: contain;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
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
