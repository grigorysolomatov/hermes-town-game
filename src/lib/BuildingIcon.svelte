<script>
  import { BUILDINGS } from './buildings.js';

  let { type } = $props();
  let b = $derived(BUILDINGS[type]);
</script>

{#if b.image}
  <img src={b.image} alt={b.name} draggable="false" />
{:else}
  <span class="emoji">{b.emoji}</span>
{/if}

<style>
  /* Sizes relative to the nearest container (the .tile sets container-type),
     so the icon scales with whatever cell / chip it sits in. */
  .emoji {
    font-size: 58cqmin;
    line-height: 1;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.45));
  }
  img {
    width: 72%;
    height: 72%;
    object-fit: contain;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.45));
  }
</style>
