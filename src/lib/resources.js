// Resource catalogue. Icons double as the flying token art and the counter
// icon, so a resource looks consistent from production to arrival.
export const RESOURCES = {
  food:     { key: 'food',     icon: '🍞', name: 'Food',     tint: '#fbbf24' },
  wood:     { key: 'wood',     icon: '🪵', name: 'Wood',     tint: '#c98a4b' },
  stone:    { key: 'stone',    icon: '🪨', name: 'Stone',    tint: '#cbd5e1' },
  science:  { key: 'science',  icon: '🧪', name: 'Science',  tint: '#38bdf8' },
  medicine: { key: 'medicine', icon: '💊', name: 'Medicine', tint: '#f472b6' },
};

// Display order in the top bar.
export const RESOURCE_ORDER = ['food', 'wood', 'stone', 'science', 'medicine'];
