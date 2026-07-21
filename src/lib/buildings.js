import coffeeShopImg from './assets/coffee-shop.png';
import sawmillImg from './assets/sawmill.png';
import quarryImg from './assets/quarry.png';
import farmImg from './assets/farm.png';
import pharmaImg from './assets/pharma.png';
import labImg from './assets/lab.png';
import mineImg from './assets/mine.png';
import tradePostImg from './assets/tradepost.png';
import coffeeChargeImg from './assets/res-coffee.png';
import pistonImg from './assets/piston.png';
import batteryImg from './assets/res-battery.png';

// Building catalogue. The map key is the building's id.
//   emoji       shown on the tile (see BuildingIcon)
//   image       null = use the emoji; set a URL/import to use real art instead
//   tint        theme colour for the tile
//   produces    resource key this building outputs when triggered, or null
//   special     a non-production effect the worker applies (see worker.svelte.js):
//                 'energy' coffee — restores worker energy
//                 'lift'   spring — sends the worker up a row
//                 'trade'  trade post — sells adjacent goods for coins
//   startStored initial (and per-turn recharge) charge count for `special` tiles
//   sellable    whether a trade post may sell this tile's stored (producers implied)
export const BUILDINGS = {
  farm:    { name: 'Farm',    emoji: '🌾', image: farmImg, tint: '#fbbf24', produces: 'food' },
  sawmill: { name: 'Sawmill', emoji: '🪚', image: sawmillImg, tint: '#c98a4b', produces: 'wood' },
  quarry:  { name: 'Quarry',  emoji: '⛏️', image: quarryImg, tint: '#a78bfa', produces: 'stone' },
  mine:    { name: 'Mine',    emoji: '⛏️', image: mineImg, tint: '#6b7280', produces: 'coal' },
  lab:     { name: 'Lab',     emoji: '🔬', image: labImg, tint: '#38bdf8', produces: 'science' },
  pharma:  { name: 'Pharma',  emoji: '🏥', image: pharmaImg, tint: '#f472b6', produces: 'medicine' },
  coffee:  { name: 'Coffee Shop', emoji: '☕', image: coffeeShopImg, badgeImage: coffeeChargeImg, tint: '#b08968', produces: null, special: 'energy', startStored: 1, sellable: true },
  piston:  { name: 'Piston',  emoji: '🔩', image: pistonImg, badgeImage: batteryImg, tint: '#93a3b8', produces: null, special: 'lift', startStored: 1 },
  tradepost: { name: 'Trade Post', emoji: '🤝', image: tradePostImg, tint: '#f0b429', produces: 'coin', special: 'trade' },
};

// Order shown in the palette.
export const PALETTE = ['farm', 'sawmill', 'quarry', 'mine', 'lab', 'pharma', 'coffee', 'piston', 'tradepost'];

// Stored value a freshly-placed (or recharged) building of this type starts at.
export const initialStored = (type) => BUILDINGS[type].startStored ?? 0;
