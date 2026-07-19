<script>
  import Grid from './lib/Grid.svelte';
  import Palette from './lib/Palette.svelte';
  import DragLayer from './lib/DragLayer.svelte';
</script>

<main class="stage">
  <header class="topbar">
    <span class="logo">🏛️ Hermes Town</span>
  </header>

  <section class="board-area">
    <Grid />
  </section>

  <Palette />

  <DragLayer />
</main>

<style>
  .stage {
    display: flex;
    flex-direction: column;
  }
  .topbar {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .logo {
    font-weight: 700;
    letter-spacing: 0.04em;
    font-size: 1.05rem;
  }
  .board-area {
    flex: 1 1 auto;
    min-height: 0;
    display: grid;
    place-items: center;
    padding: 14px;
  }
</style>
