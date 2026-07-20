import coffeeShopImg from './assets/coffee-shop.png';
import sawmillImg from './assets/sawmill.png';
import quarryImg from './assets/quarry.png';
import farmImg from './assets/farm.png';

// Building catalogue. The map key is the building's id.
//   emoji       shown on the tile (see BuildingIcon)
//   image       null = use the emoji; set a URL/import to use real art instead
//   tint        theme colour for the tile
//   produces    resource key this building outputs when triggered, or null
//   special     a non-production effect the worker applies instead (see worker.svelte.js)
//   startStored initial (and per-turn recharge) charge count for `special` tiles
export const BUILDINGS = {
  farm:    { name: 'Farm',    emoji: '🌾', image: farmImg, tint: '#fbbf24', produces: 'food' },
  sawmill: { name: 'Sawmill', emoji: '🪚', image: sawmillImg, tint: '#c98a4b', produces: 'wood' },
  quarry:  { name: 'Quarry',  emoji: '⛏️', image: quarryImg, tint: '#a78bfa', produces: 'stone' },
  lab:     { name: 'Lab',     emoji: '🔬', image: null, tint: '#38bdf8', produces: 'science' },
  pharma:  { name: 'Pharma',  emoji: '🏥', image: null, tint: '#f472b6', produces: 'medicine' },
  coffee:  { name: 'Coffee Shop', emoji: '☕', image: coffeeShopImg, tint: '#b08968', produces: null, special: 'lift', startStored: 1 },
};

// Order shown in the palette.
export const PALETTE = ['farm', 'sawmill', 'quarry', 'lab', 'pharma', 'coffee'];

// Stored value a freshly-placed (or recharged) building of this type starts at.
export const initialStored = (type) => BUILDINGS[type].startStored ?? 0;
