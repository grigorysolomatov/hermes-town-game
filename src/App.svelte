<script>
  import Grid from './lib/Grid.svelte';
  import Palette from './lib/Palette.svelte';
  import DragLayer from './lib/DragLayer.svelte';
  import FlyLayer from './lib/FlyLayer.svelte';
  import ResourceBar from './lib/ResourceBar.svelte';
  import RunControls from './lib/RunControls.svelte';
</script>

<main class="stage">
  <ResourceBar />

  <section class="board-area">
    <Grid />
  </section>

  <RunControls />
  <Palette />

  <FlyLayer />
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
