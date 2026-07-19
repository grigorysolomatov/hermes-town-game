<script>
  import { RESOURCES } from './resources.js';

  let { rkey, amount } = $props();
  let cfg = $derived(RESOURCES[rkey]);

  // Pulse whenever the amount changes (i.e. when a token has just landed).
  let bump = $state(false);
  let prev;
  $effect(() => {
    const a = amount;
    if (prev !== undefined && a !== prev) {
      bump = false;
      // Double rAF restarts the CSS animation cleanly on rapid arrivals.
      requestAnimationFrame(() => requestAnimationFrame(() => (bump = true)));
    }
    prev = a;
  });
</script>

<div
  class="chip"
  class:bump
  data-counter={rkey}
  style="--glow:{cfg.tint}"
  title={cfg.name}
  onanimationend={() => (bump = false)}
>
  <span class="icon">{cfg.icon}</span>
  <span class="amount">{Math.floor(amount)}</span>
</div>

<style>
  .chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 11px 5px 9px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  }
  .chip.bump {
    animation: bump 0.45s ease;
  }
  @keyframes bump {
    0%,
    100% {
      transform: scale(1);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    }
    30% {
      transform: scale(1.22);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--glow) 60%, transparent),
        0 0 18px color-mix(in srgb, var(--glow) 55%, transparent);
    }
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
