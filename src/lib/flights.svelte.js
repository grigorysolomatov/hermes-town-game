import { game } from './game.svelte.js';

// In-flight resource tokens travelling from a producing tile to its counter.
export const flights = $state({ list: [] });

let fid = 0;

// Spawn a token for one unit of `key` produced by the building with `uid`.
// Positions are read from the live DOM (viewport coords) so tokens fly from
// wherever the tile currently is to wherever the counter currently is.
export function emit(uid, key) {
  const src = document.querySelector(`[data-uid="${uid}"]`);
  const dst = document.querySelector(`[data-counter="${key}"]`);

  // If either endpoint is missing, still credit the unit so production isn't
  // silently lost (the counter will pulse via its own change effect).
  if (!src || !dst) {
    credit(key);
    return;
  }

  const s = src.getBoundingClientRect();
  const d = dst.getBoundingClientRect();
  flights.list.push({
    id: ++fid,
    key,
    from: { x: s.left + s.width / 2, y: s.top + s.height / 2 },
    to: { x: d.left + d.width / 2, y: d.top + d.height / 2 },
  });
}

// Called when a token reaches its counter: credit the resource and remove it.
export function land(id) {
  const i = flights.list.findIndex((f) => f.id === id);
  if (i < 0) return;
  credit(flights.list[i].key);
  flights.list.splice(i, 1);
}

function credit(key) {
  game.resources[key] = (game.resources[key] ?? 0) + 1;
}
