// Reactive game state. The board is a flat array of 25 cells (5×5).
// Each cell is either null or a placed building: { uid, type }.
export const game = $state({
  grid: Array(25).fill(null), // each cell: null | { uid, type, stored }
  justMoved: null,   // uid to skip FLIP for (its motion was already shown by the drag ghost)
});

// Stable unique ids so pieces keep their identity when moved between cells
// (this is what lets the FLIP animation glide them instead of popping).
let uid = 0;
export const newUid = () => ++uid;
