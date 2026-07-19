<script>
  import { drag } from './drag.svelte.js';
  import { BUILDINGS } from './buildings.js';
  import BuildingIcon from './BuildingIcon.svelte';
  import { scale } from 'svelte/transition';
</script>

{#if drag.active}
  <div
    class="ghost"
    style="left:{drag.x}px; top:{drag.y}px; --tint:{BUILDINGS[drag.type].tint}"
    transition:scale={{ duration: 140, start: 0.6 }}
  >
    <div class="tile"><BuildingIcon type={drag.type} /></div>
  </div>
{/if}

<style>
  .ghost {
    position: fixed;
    z-index: 50;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(1.12) rotate(-4deg);
  }
  .tile {
    width: min(20vmin, 84px);
    height: min(20vmin, 84px);
    border-radius: 15px;
    display: grid;
    place-items: center;
    container-type: size;
    opacity: 0.95;
    background: linear-gradient(
      160deg,
      color-mix(in srgb, var(--tint) 40%, transparent),
      color-mix(in srgb, var(--tint) 14%, transparent)
    );
    box-shadow: 0 18px 34px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      inset 0 0 0 1px color-mix(in srgb, var(--tint) 45%, transparent);
  }
</style>
