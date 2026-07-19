<script>
  import { game } from './game.svelte.js';
  import { drag, startDrag, canDropAt } from './drag.svelte.js';
  import { BUILDINGS } from './buildings.js';
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
      <div
        class="piece"
        role="button"
        tabindex="0"
        aria-label={BUILDINGS[p.type].name}
        class:hidden={isBeingDragged(p.index)}
        style="left:{(p.index % 5) * 20}%; top:{Math.floor(p.index / 5) * 20}%; --tint:{BUILDINGS[p.type].tint}"
        animate:flip={{ duration: 240 }}
        in:scale={{ duration: 220, start: 0.4 }}
        out:scale={{ duration: 150 }}
        onpointerdown={(e) => startDrag(e, p.type, { source: 'grid', index: p.index })}
      >
        <div class="tile"><BuildingIcon type={p.type} /></div>
      </div>
    {/each}
  </div>
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
    transition: box-shadow 0.15s ease, transform 0.12s ease;
  }
  .tile:active {
    cursor: grabbing;
    transform: scale(0.96);
  }
</style>
