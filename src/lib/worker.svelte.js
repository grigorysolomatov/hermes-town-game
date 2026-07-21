import { game } from './game.svelte.js';
import { BUILDINGS, initialStored } from './buildings.js';
import { SNAKE_PATH as PATH, cellAbove, neighbors } from './grid.js';

// Worker step pace (ms per cell) — this is the "how fast the turn plays out".
export const SPEEDS = [
  { name: 'slow',   label: 'Slow',   icon: '▸', ms: 300 },
  { name: 'normal', label: 'Normal', icon: '▸▸', ms: 160 },
  { name: 'fast',   label: 'Fast',   icon: '▸▸▸', ms: 75 },
];

// Energy the worker starts each turn with. Every activation spends 1; coffee
// restores 5. Tunable.
export const START_ENERGY = 10;
const COFFEE_RESTORE = 5;

export const worker = $state({
  running: false,
  index: null,     // current grid cell, or null when idle
  turn: 0,
  energy: START_ENERGY,
  speed: 'normal',
  flashes: [],     // active trigger pulses: { id, uid, delta } (delta drives the floating label)
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
  worker.energy = START_ENERGY;

  // Recharge charge tiles (coffee, piston) at the start of each turn. Only tiles
  // with a defined startStored reset; producers and trade posts keep their stock.
  for (const cell of game.grid) {
    if (cell && BUILDINGS[cell.type].startStored != null) {
      cell.stored = initialStored(cell.type);
    }
  }

  let i = 0;
  const step = () => {
    const cell = PATH[i];
    worker.index = cell;

    let next = i + 1;

    const b = game.grid[cell];
    if (b) {
      const def = BUILDINGS[b.type];
      if (def.special === 'energy') {
        // Coffee: spends one charge to restore worker energy. Free to use (it's
        // the energy source), so it works even at 0 energy.
        if ((b.stored ?? 0) > 0) {
          b.stored -= 1;
          worker.energy += COFFEE_RESTORE;
          flash(b.uid, -1);
        }
      } else if (def.special === 'lift') {
        // Spring: spends one charge (and 1 energy) to send the worker up a row,
        // re-sweeping the producers below. Inert at 0 charges, so runs stay finite.
        if ((b.stored ?? 0) > 0 && worker.energy > 0) {
          b.stored -= 1;
          worker.energy -= 1;
          flash(b.uid, -1);
          const above = cellAbove(cell);
          if (above != null) next = PATH.indexOf(above);
        }
      } else if (def.special === 'trade') {
        // Trade Post: for one energy, sells one unit from each adjacent sellable
        // tile (producers + coffee, incl. diagonals) for one coin each. Flat price.
        if (worker.energy > 0) {
          let coins = 0;
          for (const n of neighbors(cell)) {
            const nb = game.grid[n];
            if (nb && isSellable(nb.type) && (nb.stored ?? 0) > 0) {
              nb.stored -= 1;
              flash(nb.uid, -1); // red −1 over the sold-from tile
              coins += 1;
            }
          }
          if (coins > 0) {
            worker.energy -= 1;
            b.stored = (b.stored ?? 0) + coins;
            flash(b.uid, coins);
          }
        }
      } else if (def.produces) {
        // Producers fire each time the worker hits them, if it has energy to spend.
        if (worker.energy > 0) {
          worker.energy -= 1;
          b.stored = (b.stored ?? 0) + 1;
          flash(b.uid, 1);
        }
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

// Whether a trade post may sell this building type's stored goods. Producers are
// sellable by default; `sellable` overrides (coffee opts in, piston stays out).
function isSellable(type) {
  const def = BUILDINGS[type];
  return def.sellable ?? (!!def.produces && !def.special);
}

let flashId = 0;
function flash(uid, delta) {
  const id = ++flashId;
  worker.flashes.push({ id, uid, delta });
  setTimeout(() => {
    const i = worker.flashes.findIndex((f) => f.id === id);
    if (i >= 0) worker.flashes.splice(i, 1);
  }, 380);
}
