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
    padding: 10px 16px;
    border-radius: 12px;
    border: none;
    font: inherit;
    font-weight: 600;
    font-size: 0.92rem;
    color: #0f0d1c;
    background: linear-gradient(160deg, #a78bfa, #7c6cff);
    box-shadow: 0 6px 18px rgba(124, 108, 255, 0.4);
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.15s ease, filter 0.15s ease;
  }
  .start:hover:not(:disabled) {
    filter: brightness(1.06);
  }
  .start:active:not(:disabled) {
    transform: scale(0.97);
  }
  .start:disabled {
    cursor: default;
    filter: saturate(0.5) brightness(0.85);
    box-shadow: none;
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #0f0d1c;
    animation: pulse 0.8s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.1); }
  }
</style>
