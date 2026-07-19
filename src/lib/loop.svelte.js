import { game } from './game.svelte.js';

// Per-farm production. Central so more building outputs can be added later.
const FOOD_PER_FARM = 1; // food / second at normal speed

let raf = 0;
let last = null;

function frame(t) {
  const dt = last == null ? 0 : (t - last) / 1000;
  last = t;

  if (game.speed > 0) {
    let farms = 0;
    for (const cell of game.grid) if (cell?.type === 'farm') farms++;
    game.resources.food += farms * FOOD_PER_FARM * game.speed * dt;
  }

  raf = requestAnimationFrame(frame);
}

export function startLoop() {
  last = null;
  raf = requestAnimationFrame(frame);
}

export function stopLoop() {
  cancelAnimationFrame(raf);
}
