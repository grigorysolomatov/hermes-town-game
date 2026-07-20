<script>
  import { game } from './game.svelte.js';
  import { RESOURCE_ORDER } from './resources.js';
  import ResourceChip from './ResourceChip.svelte';
</script>

<header class="topbar">
  <div class="resources">
    {#each RESOURCE_ORDER as key (key)}
      <ResourceChip rkey={key} amount={game.resources[key] ?? 0} />
    {/each}
  </div>
</header>

<style>
  .topbar {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0));
  }
  .resources {
    flex: 1 1 auto;
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }
</style>
