import coffeeShopImg from './assets/coffee-shop.png';
import sawmillImg from './assets/sawmill.png';
import quarryImg from './assets/quarry.png';
import farmImg from './assets/farm.png';
import coalmineImg from './assets/coalmine.png';
import pharmaImg from './assets/pharma.png';
import labImg from './assets/lab.png';
import mineImg from './assets/mine.png';

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
  coalmine: { name: 'Coal Mine', emoji: '⛏️', image: coalmineImg, tint: '#6b7280', produces: 'coal' },
  mine:    { name: 'Mine',    emoji: '⛏️', image: mineImg, tint: '#8b7355', produces: 'coal' },
  lab:     { name: 'Lab',     emoji: '🔬', image: labImg, tint: '#38bdf8', produces: 'science' },
  pharma:  { name: 'Pharma',  emoji: '🏥', image: pharmaImg, tint: '#f472b6', produces: 'medicine' },
  coffee:  { name: 'Coffee Shop', emoji: '☕', image: coffeeShopImg, tint: '#b08968', produces: null, special: 'lift', startStored: 1 },
};

// Order shown in the palette.
export const PALETTE = ['farm', 'sawmill', 'quarry', 'coalmine', 'mine', 'lab', 'pharma', 'coffee'];

// Stored value a freshly-placed (or recharged) building of this type starts at.
export const initialStored = (type) => BUILDINGS[type].startStored ?? 0;
