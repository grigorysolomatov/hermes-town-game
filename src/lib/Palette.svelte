<script>
  import { BUILDINGS, PALETTE } from './buildings.js';
  import { startDrag } from './drag.svelte.js';
  import BuildingIcon from './BuildingIcon.svelte';

  let collapsed = $state(false);
</script>

<div class="palette" class:collapsed>
  <button class="handle" onclick={() => (collapsed = !collapsed)} aria-expanded={!collapsed}>
    <span class="grip"></span>
    <span class="label">Buildings</span>
    <span class="chev" class:up={collapsed}>⌄</span>
  </button>

  <div class="items-wrap">
    <div class="items">
      {#each PALETTE as id}
        <button
          class="item"
          style="--tint:{BUILDINGS[id].tint}"
          onpointerdown={(e) => startDrag(e, id, { source: 'palette' })}
        >
          <div class="tile"><BuildingIcon type={id} /></div>
          <span class="name">{BUILDINGS[id].name}</span>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .palette {
    flex: 0 0 auto;
    position: relative;
    border-top: 3px solid var(--ink);
    background: var(--panel);
  }

  .handle {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 16px 10px;
    background: none;
    border: none;
    color: var(--text);
    font: inherit;
    cursor: pointer;
  }
  .grip {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.28);
  }
  .handle .label {
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .chev {
    margin-left: auto;
    font-size: 1.2rem;
    color: var(--muted);
    transition: transform 0.25s ease;
  }
  .chev.up {
    transform: rotate(180deg);
  }

  /* Fade the right edge to hint that the row scrolls to more buildings. */
  .items-wrap {
    position: relative;
  }
  .items-wrap::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 32px;
    pointer-events: none;
    background: linear-gradient(to right, rgba(248, 236, 214, 0), var(--panel));
    transition: opacity 0.25s ease;
  }
  .palette.collapsed .items-wrap::after {
    opacity: 0;
  }

  .items {
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
    padding: 6px 16px 18px;
    overflow-x: auto;
    overflow-y: hidden;
    max-height: 160px;
    opacity: 1;
    /* Let the browser pan horizontally; vertical pulls become building drags. */
    touch-action: pan-x;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
    transition: max-height 0.3s ease, opacity 0.25s ease, padding 0.3s ease;
  }
  .items::-webkit-scrollbar {
    height: 6px;
  }
  .items::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.22);
    border-radius: 3px;
  }
  .palette.collapsed .items {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
  }

  .item {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    background: none;
    border: none;
    color: var(--muted);
    font: inherit;
    cursor: grab;
    /* Horizontal swipe on an item scrolls the panel; vertical pull drags it. */
    touch-action: pan-x;
  }
  .item .name {
    white-space: nowrap;
  }
  .item .tile {
    width: 64px;
    height: 64px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    container-type: size;
    background: var(--card);
    box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--tint) 55%, var(--card)),
      0 3px 0 rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.16);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .item:hover .tile {
    transform: translateY(-3px);
    box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--tint) 70%, var(--card)),
      0 5px 0 rgba(0, 0, 0, 0.2), 0 10px 18px rgba(0, 0, 0, 0.22);
  }
  .item:active .tile {
    transform: scale(0.94);
  }
  .name {
    font-size: 0.75rem;
    letter-spacing: 0.02em;
  }
</style>
