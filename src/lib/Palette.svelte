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

<style>
  .palette {
    flex: 0 0 auto;
    position: relative;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.18));
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
    background: rgba(255, 255, 255, 0.22);
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

  .items {
    display: flex;
    gap: 12px;
    padding: 6px 16px 18px;
    overflow-x: auto;
    max-height: 160px;
    opacity: 1;
    transition: max-height 0.3s ease, opacity 0.25s ease, padding 0.3s ease;
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
    touch-action: none;
  }
  .item .tile {
    width: 64px;
    height: 64px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    container-type: size;
    background: linear-gradient(
      160deg,
      color-mix(in srgb, var(--tint) 30%, transparent),
      color-mix(in srgb, var(--tint) 8%, transparent)
    );
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 0 0 0 1px color-mix(in srgb, var(--tint) 32%, transparent),
      0 6px 14px rgba(0, 0, 0, 0.3);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .item:hover .tile {
    transform: translateY(-3px);
    box-shadow: 0 12px 22px rgba(0, 0, 0, 0.4),
      inset 0 0 0 1px color-mix(in srgb, var(--tint) 55%, transparent);
  }
  .item:active .tile {
    transform: scale(0.94);
  }
  .name {
    font-size: 0.75rem;
    letter-spacing: 0.02em;
  }
</style>
