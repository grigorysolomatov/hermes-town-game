<script>
  import { worker, SPEEDS, startRun, setSpeed } from './worker.svelte.js';
</script>

<div class="run-controls">
  <div class="turn">Turn <b>{worker.turn}</b></div>

  <button class="start" onclick={startRun} disabled={worker.running}>
    {#if worker.running}
      <span class="dot"></span> Running…
    {:else}
      ▶ Start Run
    {/if}
  </button>

  <div class="speeds">
    {#each SPEEDS as s (s.name)}
      <button
        class="sp"
        class:active={worker.speed === s.name}
        onclick={() => setSpeed(s.name)}
        title={s.label}
        aria-pressed={worker.speed === s.name}
      >
        {s.icon}
      </button>
    {/each}
  </div>
</div>

<style>
  .run-controls {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
  }
  .turn {
    font-size: 0.82rem;
    color: var(--muted);
    white-space: nowrap;
  }
  .turn b {
    color: var(--text);
    font-variant-numeric: tabular-nums;
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

  .speeds {
    display: flex;
    gap: 4px;
  }
  .sp {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
  }
  .sp:active {
    transform: scale(0.92);
  }
  .sp.active {
    background: rgba(124, 108, 255, 0.22);
    box-shadow: inset 0 0 0 1px rgba(124, 108, 255, 0.7);
  }
</style>
