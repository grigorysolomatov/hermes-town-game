import { game } from './game.svelte.js';
import { BUILDINGS } from './buildings.js';
import { emit } from './flights.svelte.js';

const INTERVAL = 1; // seconds to produce one unit at normal speed
const MAX_DT = 0.25; // clamp so a backgrounded tab doesn't burst-spawn tokens

// Per-building production progress (uid -> accumulated fraction of a unit).
const progress = new Map();

let raf = 0;
let last = null;

function frame(t) {
  const dt = last == null ? 0 : Math.min((t - last) / 1000, MAX_DT);
  last = t;

  if (game.speed > 0) {
    const seen = new Set();
    for (const cell of game.grid) {
      if (!cell) continue;
      const res = BUILDINGS[cell.type].produces;
      if (!res) continue;
      seen.add(cell.uid);

      let p = (progress.get(cell.uid) ?? 0) + (game.speed * dt) / INTERVAL;
      while (p >= 1) {
        p -= 1;
        emit(cell.uid, res); // fly one unit to its counter
      }
      progress.set(cell.uid, p);
    }
    // Drop progress for buildings that are gone (removed / never producing).
    for (const uid of progress.keys()) if (!seen.has(uid)) progress.delete(uid);
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
