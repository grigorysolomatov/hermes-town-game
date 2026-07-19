<script>
  import { flights, land } from './flights.svelte.js';
  import { RESOURCES } from './resources.js';

  // Animate a token along an upward arc from its source tile to its counter,
  // then credit + remove it. Uses the Web Animations API for a clean curve.
  function fly(node, flight) {
    const { from, to } = flight;
    const midX = (from.x + to.x) / 2;
    const midY = Math.min(from.y, to.y) - 55; // arc up over the board

    const at = (x, y, s, o) =>
      `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${s})`;

    const anim = node.animate(
      [
        { transform: at(from.x, from.y, 0.5), opacity: 0 },
        { transform: at(from.x, from.y, 1.1), opacity: 1, offset: 0.14 },
        { transform: at(midX, midY, 1.1), opacity: 1, offset: 0.55 },
        { transform: at(to.x, to.y, 0.5), opacity: 0.85, offset: 1 },
      ],
      { duration: 720, easing: 'cubic-bezier(.45, 0, .25, 1)', fill: 'forwards' }
    );
    anim.onfinish = () => land(flight.id);

    return {
      destroy() {
        anim.cancel();
      },
    };
  }
</script>

<div class="fly-layer">
  {#each flights.list as f (f.id)}
    <div class="token" style="--tint:{RESOURCES[f.key].tint}" use:fly={f}>
      <span>{RESOURCES[f.key].icon}</span>
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
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 17px;
    will-change: transform, opacity;
    filter: drop-shadow(0 3px 7px rgba(0, 0, 0, 0.5))
      drop-shadow(0 0 6px color-mix(in srgb, var(--tint) 70%, transparent));
  }
</style>
