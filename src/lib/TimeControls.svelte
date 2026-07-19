<script>
  import { game } from './game.svelte.js';

  const SPEEDS = [
    { value: 0, icon: '⏸', label: 'Pause' },
    { value: 1, icon: '▶', label: 'Normal' },
    { value: 3, icon: '⏩', label: 'Fast' },
  ];
</script>

<div class="time-controls">
  {#each SPEEDS as s (s.value)}
    <button
      class="speed"
      class:active={game.speed === s.value}
      onclick={() => (game.speed = s.value)}
      aria-pressed={game.speed === s.value}
      title={s.label}
    >
      <span class="icon">{s.icon}</span>
      <span class="label">{s.label}</span>
    </button>
  {/each}
</div>

<style>
  .time-controls {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 8px 14px;
  }
  .speed {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    color: var(--muted);
    font: inherit;
    font-size: 0.82rem;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
  }
  .speed .icon {
    font-size: 0.8rem;
    line-height: 1;
  }
  .speed:hover {
    color: var(--text);
    background: rgba(255, 255, 255, 0.07);
  }
  .speed:active {
    transform: scale(0.95);
  }
  .speed.active {
    color: #0f0d1c;
    background: linear-gradient(160deg, #a78bfa, #7c6cff);
    border-color: transparent;
    box-shadow: 0 4px 14px rgba(124, 108, 255, 0.4);
  }
</style>
