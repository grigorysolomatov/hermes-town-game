<script>
  import Grid from './lib/Grid.svelte';
  import Palette from './lib/Palette.svelte';
  import DragLayer from './lib/DragLayer.svelte';
  import RunControls from './lib/RunControls.svelte';
  import Settings from './lib/Settings.svelte';
</script>

<main class="stage">
  <Settings />

  <section class="board-area">
    <Grid />
  </section>

  <RunControls />
  <Palette />

  <DragLayer />
</main>

<style>
  .stage {
    display: flex;
    flex-direction: column;
  }
  .board-area {
    flex: 1 1 auto;
    min-height: 0;
    display: grid;
    place-items: center;
    padding: 14px;
  }
</style>
