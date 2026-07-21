<script>
  import { worker, startRun } from './worker.svelte.js';
</script>

<div class="run-controls">
  <button class="start" onclick={startRun} disabled={worker.running}>
    {#if worker.running}
      <span class="dot"></span> Running…
    {:else}
      ▶ Start Turn {worker.turn + 1}
    {/if}
  </button>
</div>

<style>
  .run-controls {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
  }
  .start {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 14px;
    border: 2.5px solid var(--ink);
    font: inherit;
    font-weight: 800;
    font-size: 0.95rem;
    letter-spacing: 0.01em;
    color: #fff;
    background: var(--go);
    box-shadow: 0 4px 0 var(--ink), 0 7px 12px rgba(0, 0, 0, 0.25);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.35);
    cursor: pointer;
    transition: transform 0.08s ease, box-shadow 0.12s ease, filter 0.15s ease;
  }
  .start:hover:not(:disabled) {
    filter: brightness(1.05);
  }
  .start:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 1px 0 var(--ink), 0 2px 6px rgba(0, 0, 0, 0.25);
  }
  .start:disabled {
    cursor: default;
    filter: saturate(0.35) brightness(0.98);
    color: rgba(255, 255, 255, 0.85);
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #fff;
    animation: pulse 0.8s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.1); }
  }
</style>
