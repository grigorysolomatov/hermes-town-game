import { game } from './game.svelte.js';
import { emit } from './flights.svelte.js';
import { BUILDINGS } from './buildings.js';

const N = 5;

// Boustrophedon (snake / zig-zag) order: left→right, then right→left, row by
// row, top to bottom. Consecutive cells are always adjacent, so the worker
// glides smoothly along the whole path.
const PATH = (() => {
  const p = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const col = r % 2 === 0 ? c : N - 1 - c;
      p.push(r * N + col);
    }
  }
  return p;
})();

// Worker step pace (ms per cell) — this is the "how fast the turn plays out".
export const SPEEDS = [
  { name: 'slow',   label: 'Slow',   icon: '🐢', ms: 300 },
  { name: 'normal', label: 'Normal', icon: '🚶', ms: 160 },
  { name: 'fast',   label: 'Fast',   icon: '🐇', ms: 75 },
];

export const worker = $state({
  running: false,
  index: null,     // current grid cell, or null when idle
  turn: 0,
  speed: 'normal',
  flashing: [],     // uids of buildings mid-trigger-pulse
  exhausted: [],    // uids of coffee tiles already used this turn (grayed until next run)
});

export const stepMs = () => SPEEDS.find((s) => s.name === worker.speed).ms;

export function setSpeed(name) {
  worker.speed = name;
}

let timer = null;

// Run the worker across the whole board once. This is one turn.
export function startRun() {
  if (worker.running) return;
  worker.running = true;
  worker.turn += 1;
  worker.exhausted = []; // new turn restores every used coffee

  let i = 0;
  const step = () => {
    const cell = PATH[i];
    worker.index = cell;

    let next = i + 1;

    const b = game.grid[cell];
    if (b) {
      const def = BUILDINGS[b.type];
      if (def.special === 'lift') {
        // Coffee: fires once per turn. Activating it exhausts it (grays out) so
        // the worker can't re-trigger it and loop forever. It lifts the worker
        // up one row, letting the producers below get swept again.
        if (!worker.exhausted.includes(b.uid)) {
          worker.exhausted.push(b.uid);
          flash(b.uid);
          const row = Math.floor(cell / N);
          if (row > 0) next = PATH.indexOf(cell - N); // resume the sweep from above
        }
        // A spent coffee is inert for the rest of the turn.
      } else if (def.produces) {
        // Producers fire every time the worker hits them (coffee can combo them).
        flash(b.uid);              // pulse the tile
        emit(b.uid, def.produces); // fly one unit of its resource to the counter
      }
    }

    i = next;
    timer = setTimeout(i < PATH.length ? step : endRun, stepMs());
  };
  step();
}

function endRun() {
  worker.running = false;
  worker.index = null;
  timer = null;
}

function flash(uid) {
  worker.flashing.push(uid);
  setTimeout(() => {
    const i = worker.flashing.indexOf(uid);
    if (i >= 0) worker.flashing.splice(i, 1);
  }, 380);
}
