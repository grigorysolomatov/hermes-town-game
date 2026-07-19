<script>
  import { game } from './game.svelte.js';
  import { RESOURCE_ORDER } from './resources.js';
  import ResourceChip from './ResourceChip.svelte';
</script>

<header class="topbar">
  <span class="logo">🏛️ Hermes Town</span>
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
    gap: 10px;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0));
  }
  .logo {
    font-weight: 700;
    letter-spacing: 0.03em;
    font-size: 0.98rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
  .resources {
    margin-left: auto;
    display: flex;
    gap: 8px;
    flex: 0 0 auto;
  }
</style>
