// Building catalogue. `image` is null for now (emoji fallback), but the
// rendering path already supports images so real art can be dropped in later
// by setting `image` to a URL/imported asset. `produces` names the resource
// this building outputs (one unit per second at normal speed), or null.
export const BUILDINGS = {
  house:   { id: 'house',   name: 'House',   emoji: '🏠', image: null, tint: '#5eead4', produces: null },
  farm:    { id: 'farm',    name: 'Farm',    emoji: '🌾', image: null, tint: '#fbbf24', produces: 'food' },
  sawmill: { id: 'sawmill', name: 'Sawmill', emoji: '🪚', image: null, tint: '#c98a4b', produces: 'wood' },
  mine:    { id: 'mine',    name: 'Mine',    emoji: '⛏️', image: null, tint: '#a78bfa', produces: 'stone' },
  lab:     { id: 'lab',     name: 'Lab',     emoji: '🔬', image: null, tint: '#38bdf8', produces: 'science' },
};

// Order shown in the palette.
export const PALETTE = ['house', 'farm', 'sawmill', 'mine', 'lab'];
