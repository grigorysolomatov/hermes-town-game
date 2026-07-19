<script>
  import { game } from './game.svelte.js';

  // Resource display config — add wood/stone/etc. here as they arrive.
  const RESOURCES = [{ key: 'food', icon: '🍞', name: 'Food' }];

  let values = $derived(RESOURCES.map((r) => ({ ...r, amount: Math.floor(game.resources[r.key] ?? 0) })));
</script>

<header class="topbar">
  <span class="logo">🏛️ Hermes Town</span>
  <div class="resources">
    {#each values as r (r.key)}
      <div class="chip" title={r.name}>
        <span class="icon">{r.icon}</span>
        <span class="amount">{r.amount}</span>
      </div>
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
  }
  .resources {
    margin-left: auto;
    display: flex;
    gap: 8px;
  }
  .chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 11px 5px 9px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  }
  .icon {
    font-size: 1.05rem;
    line-height: 1;
  }
  .amount {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    font-size: 0.95rem;
    min-width: 1.2em;
    text-align: right;
  }
</style>
