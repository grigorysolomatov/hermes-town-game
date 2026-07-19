<script>
  import { flights, land } from './flights.svelte.js';
  import { RESOURCES } from './resources.js';

  // Fly a token in a straight line from its source tile to its counter.
  // The outer node handles the (linear, eased) travel; the inner node does an
  // independent scale/opacity pop so the path itself stays a straight line.
  function fly(node, flight) {
    const { from, to } = flight;

    const move = node.animate(
      [
        { transform: `translate(${from.x}px, ${from.y}px) translate(-50%, -50%)` },
        { transform: `translate(${to.x}px, ${to.y}px) translate(-50%, -50%)` },
      ],
      { duration: 700, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' }
    );

    const inner = node.firstElementChild;
    inner.animate(
      [
        { transform: 'scale(.4)', opacity: 0 },
        { transform: 'scale(1.1)', opacity: 1, offset: 0.18 },
        { transform: 'scale(1)', opacity: 1, offset: 0.8 },
        { transform: 'scale(.6)', opacity: 0.85 },
      ],
      { duration: 700, easing: 'ease-out', fill: 'forwards' }
    );

    move.onfinish = () => land(flight.id);

    return {
      destroy() {
        move.cancel();
      },
    };
  }
</script>

<div class="fly-layer">
  {#each flights.list as f (f.id)}
    <div class="token" style="--tint:{RESOURCES[f.key].tint}" use:fly={f}>
      <span class="icon">{RESOURCES[f.key].icon}</span>
    </div>
  {/each}
</div>

<style>
  .fly-layer {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 40;
  }
  .token {
    position: fixed;
    left: 0;
    top: 0;
    width: 30px;
    height: 30px;
    will-change: transform;
  }
  .icon {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    font-size: 17px;
    will-change: transform, opacity;
    filter: drop-shadow(0 3px 7px rgba(0, 0, 0, 0.5))
      drop-shadow(0 0 6px color-mix(in srgb, var(--tint) 70%, transparent));
  }
</style>
