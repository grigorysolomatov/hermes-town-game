import { CELL_COUNT } from './grid.js';

// Reactive game state. The board is a flat array of CELL_COUNT cells; each is
// either null or a placed building: { uid, type, stored }.
export const game = $state({
  grid: Array(CELL_COUNT).fill(null),
  justMoved: null, // uid to skip FLIP for (its motion was already shown by the drag ghost)
});

// Stable unique ids so pieces keep their identity when moved between cells
// (this is what lets the FLIP animation glide them instead of popping).
let uid = 0;
export const newUid = () => ++uid;
