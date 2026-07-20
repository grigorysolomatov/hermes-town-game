import { tick } from 'svelte';
import { game, newUid } from './game.svelte.js';

// Custom pointer-based drag (works for both touch and mouse, unlike the native
// HTML5 drag-and-drop which is unreliable on mobile).
export const drag = $state({
  pending: false,   // pointer down, but movement threshold not yet crossed
  active: false,    // a real drag is in progress (ghost visible)
  type: null,       // building type id being dragged
  from: null,       // { source: 'palette' } | { source: 'grid', index }
  startX: 0, startY: 0,
  x: 0, y: 0,       // current pointer position (viewport coords)
  overIndex: null,  // grid cell currently under the pointer, or null
});

const THRESHOLD = 6; // px before a press becomes a drag

function cellAt(x, y) {
  const el = document.elementFromPoint(x, y);
  const cell = el && el.closest?.('[data-cell]');
  return cell ? Number(cell.dataset.cell) : null;
}

export function canDropAt(index) {
  if (index == null) return false;
  // Moving within the grid can always land (move into empty / swap with piece).
  if (drag.from?.source === 'grid') return true;
  // From the palette we only place onto empty cells.
  return game.grid[index] == null;
}

export function startDrag(e, type, from) {
  if (drag.pending) return;
  // Grid pieces take over immediately (they live outside any scroll area).
  // Palette items defer: a horizontal swipe should scroll the panel instead,
  // so we only claim the gesture once it proves to be a vertical pull.
  if (from.source === 'grid') e.preventDefault();
  drag.pending = true;
  drag.active = false;
  drag.type = type;
  drag.from = from;
  drag.startX = drag.x = e.clientX;
  drag.startY = drag.y = e.clientY;
  drag.overIndex = null;
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', cleanup);
}

function onMove(e) {
  drag.x = e.clientX;
  drag.y = e.clientY;

  if (!drag.active) {
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (Math.hypot(dx, dy) < THRESHOLD) return;
    // From the palette, a mostly-horizontal move is a scroll gesture: bow out
    // and let the browser pan the panel (touch-action: pan-x handles it).
    if (drag.from?.source === 'palette' && Math.abs(dx) > Math.abs(dy)) {
      cleanup();
      return;
    }
    drag.active = true;
  }

  // Prevent the page/panel from scrolling while an actual drag is in progress.
  e.preventDefault();
  drag.overIndex = cellAt(e.clientX, e.clientY);
}

function onUp(e) {
  if (drag.active) resolveDrop(cellAt(e.clientX, e.clientY));
  cleanup();
  // Clear the skip-FLIP flag once the DOM has settled, so future moves of the
  // same piece (e.g. when swapped by another drag) animate normally again.
  tick().then(() => {
    game.justMoved = null;
  });
}

function resolveDrop(target) {
  const { from, type } = drag;
  if (from.source === 'palette') {
    if (target != null && game.grid[target] == null) {
      game.grid[target] = { uid: newUid(), type, stored: 0 };
    }
    return;
  }
  // from grid: move or swap. Drop outside the grid = cancel (snap back).
  const src = from.index;
  if (target == null || target === src) return;
  const moving = game.grid[src];
  const occupant = game.grid[target];
  // The ghost already animated the dragged piece's motion, so don't FLIP it too.
  game.justMoved = moving.uid;
  game.grid[target] = moving;
  game.grid[src] = occupant ?? null;
}

function cleanup() {
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
  window.removeEventListener('pointercancel', cleanup);
  drag.pending = false;
  drag.active = false;
  drag.type = null;
  drag.from = null;
  drag.overIndex = null;
}
