// Board geometry — the single source of truth for grid dimensions. Everything
// that does index↔row/col math or positions things on the board derives from
// GRID_SIZE, so changing the board size is a one-line change here.
export const GRID_SIZE = 5;
export const CELL_COUNT = GRID_SIZE * GRID_SIZE;
export const CELL_PCT = 100 / GRID_SIZE; // one cell's width/height, in %

export const rowOf = (i) => Math.floor(i / GRID_SIZE);
export const colOf = (i) => i % GRID_SIZE;

// The cell directly above `i`, or null if `i` is on the top row.
export const cellAbove = (i) => (rowOf(i) > 0 ? i - GRID_SIZE : null);

// Percent offset of a cell's top-left corner within the board.
export const cellLeft = (i) => colOf(i) * CELL_PCT;
export const cellTop = (i) => rowOf(i) * CELL_PCT;

// Boustrophedon (snake / zig-zag) traversal order: row 0 left→right, row 1
// right→left, … top to bottom. Consecutive cells are always adjacent, so a
// mover following this path glides smoothly.
export const SNAKE_PATH = (() => {
  const path = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const col = r % 2 === 0 ? c : GRID_SIZE - 1 - c;
      path.push(r * GRID_SIZE + col);
    }
  }
  return path;
})();
