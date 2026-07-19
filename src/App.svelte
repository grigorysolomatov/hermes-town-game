<script>
  import { onMount } from 'svelte';
  import Grid from './lib/Grid.svelte';
  import Palette from './lib/Palette.svelte';
  import DragLayer from './lib/DragLayer.svelte';
  import FlyLayer from './lib/FlyLayer.svelte';
  import ResourceBar from './lib/ResourceBar.svelte';
  import TimeControls from './lib/TimeControls.svelte';
  import { startLoop, stopLoop } from './lib/loop.svelte.js';

  onMount(() => {
    startLoop();
    return stopLoop;
  });
</script>

<main class="stage">
  <ResourceBar />

  <section class="board-area">
    <Grid />
  </section>

  <TimeControls />
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
