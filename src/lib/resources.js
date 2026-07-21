import foodImg from './assets/res-food.png';
import woodImg from './assets/res-wood.png';
import stoneImg from './assets/res-stone.png';
import coalImg from './assets/res-coal.png';
import scienceImg from './assets/res-science.png';
import medicineImg from './assets/res-medicine.png';
import coinImg from './assets/res-coin.png';

// Resource catalogue. The map key is the resource id. `image` is the icon shown
// on tile badges; `icon` (emoji) is kept as a fallback.
export const RESOURCES = {
  food:     { icon: '🍞', image: foodImg,     name: 'Food',     tint: '#fbbf24' },
  wood:     { icon: '🪵', image: woodImg,     name: 'Wood',     tint: '#c98a4b' },
  stone:    { icon: '🪨', image: stoneImg,    name: 'Stone',    tint: '#cbd5e1' },
  coal:     { icon: '⚫', image: coalImg,     name: 'Coal',     tint: '#6b7280' },
  science:  { icon: '🧪', image: scienceImg,  name: 'Science',  tint: '#38bdf8' },
  medicine: { icon: '💊', image: medicineImg, name: 'Medicine', tint: '#f472b6' },
  coin:     { icon: '🪙', image: coinImg,     name: 'Coin',     tint: '#f0b429' },
};
