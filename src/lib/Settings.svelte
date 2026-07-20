<script>
  import { worker, SPEEDS, setSpeed } from './worker.svelte.js';
  import { fade, scale } from 'svelte/transition';

  let open = $state(false);
</script>

<svelte:window
  onkeydown={(e) => {
    if (open && e.key === 'Escape') open = false;
  }}
/>

<button class="gear" class:on={open} onclick={() => (open = !open)} aria-label="Settings">⚙️</button>

{#if open}
  <div class="backdrop" onclick={() => (open = false)} transition:fade={{ duration: 150 }}>
    <div
      class="modal"
      role="dialog"
      aria-label="Settings"
      onclick={(e) => e.stopPropagation()}
      transition:scale={{ duration: 180, start: 0.92 }}
    >
      <header>
        <h2>Settings</h2>
        <button class="close" onclick={() => (open = false)} aria-label="Close">✕</button>
      </header>

      <section class="setting">
        <span class="setting-label">Worker speed</span>
        <div class="speeds">
          {#each SPEEDS as s (s.name)}
            <button
              class="sp"
              class:active={worker.speed === s.name}
              onclick={() => setSpeed(s.name)}
              aria-pressed={worker.speed === s.name}
            >
              <span class="ic">{s.icon}</span>
              <span class="lb">{s.label}</span>
            </button>
          {/each}
        </div>
      </section>
    </div>
  </div>
{/if}

<style>
  /* Floats in the top-right corner of the stage. */
  .gear {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 25;
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(4px);
    font-size: 1.05rem;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.2s ease;
  }
  .gear:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  .gear.on {
    transform: rotate(45deg);
    background: rgba(124, 108, 255, 0.22);
    box-shadow: inset 0 0 0 1px rgba(124, 108, 255, 0.7);
  }

  /* Contained within the stage frame (stage is position:relative). */
  .backdrop {
    position: absolute;
    inset: 0;
    z-index: 60;
    display: grid;
    place-items: center;
    padding: 20px;
    background: rgba(5, 4, 12, 0.55);
    backdrop-filter: blur(3px);
  }
  .modal {
    width: min(320px, 100%);
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(180deg, #1b1830, #141223);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
    overflow: hidden;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  h2 {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .close {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    border: none;
    background: rgba(255, 255, 255, 0.06);
    color: var(--muted);
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .close:hover {
    background: rgba(255, 255, 255, 0.12);
    color: var(--text);
  }

  .setting {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .setting-label {
    font-size: 0.82rem;
    color: var(--muted);
  }
  .speeds {
    display: flex;
    gap: 8px;
  }
  .sp {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 6px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    color: var(--muted);
    font: inherit;
    cursor: pointer;
    transition: background 0.15s ease, box-shadow 0.15s ease, color 0.15s ease, transform 0.1s ease;
  }
  .sp .ic {
    font-size: 1.25rem;
    line-height: 1;
  }
  .sp .lb {
    font-size: 0.75rem;
  }
  .sp:active {
    transform: scale(0.95);
  }
  .sp.active {
    color: var(--text);
    background: rgba(124, 108, 255, 0.22);
    box-shadow: inset 0 0 0 1px rgba(124, 108, 255, 0.7);
  }
</style>
