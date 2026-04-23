// store.jsx — runtime + localStorage state for Oddments

const LS_KEY = "oddments:v1";

function loadFromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.curiosities) return null;
    return parsed;
  } catch (e) { return null; }
}

function saveToLS(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      curiosities: state.curiosities,
      collections: state.collections,
      sortBy: state.sortBy,
      view: state.view,
    }));
  } catch (e) {}
}

function useStore() {
  const initial = React.useMemo(() => {
    const cached = loadFromLS();
    if (cached) {
      // Always refresh images for seed items so seed.js changes are visible without wiping user data
      const seedImageMap = Object.fromEntries(window.SEED.curiosities.map(c => [c.id, c.image]));
      return {
        curiosities: cached.curiosities.map(c => seedImageMap[c.id] ? { ...c, image: seedImageMap[c.id] } : c),
        collections: cached.collections,
        sortBy: cached.sortBy || "newest",
        view: cached.view || "grid",
      };
    }
    return {
      curiosities: window.SEED.curiosities,
      collections: window.SEED.collections,
      sortBy: "newest",
      view: "grid",
    };
  }, []);

  const [curiosities, setCuriosities] = React.useState(initial.curiosities);
  const [collections, setCollections] = React.useState(initial.collections);
  const [sortBy, setSortBy] = React.useState(initial.sortBy);
  const [view, setView] = React.useState(initial.view);

  React.useEffect(() => {
    saveToLS({ curiosities, collections, sortBy, view });
  }, [curiosities, collections, sortBy, view]);

  // Helpers
  const addCuriosity = (item) => {
    const id = "c" + Date.now();
    const newItem = { id, added: new Date().toISOString().slice(0, 10), favorite: false, ...item };
    setCuriosities(prev => [newItem, ...prev]);
    setCollections(prev => prev.map(c => c.id === newItem.collection ? { ...c, count: c.count + 1 } : c));
    return id;
  };

  const updateCuriosity = (id, patch) => {
    setCuriosities(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  const removeCuriosity = (id) => {
    const item = curiosities.find(c => c.id === id);
    setCuriosities(prev => prev.filter(c => c.id !== id));
    if (item) setCollections(prev => prev.map(c => c.id === item.collection ? { ...c, count: Math.max(0, c.count - 1) } : c));
  };

  const duplicateCuriosity = (id) => {
    const item = curiosities.find(c => c.id === id);
    if (!item) return;
    const dup = { ...item, id: "c" + Date.now(), title: item.title + " (copy)", favorite: false, added: new Date().toISOString().slice(0, 10) };
    setCuriosities(prev => [dup, ...prev]);
    setCollections(prev => prev.map(c => c.id === dup.collection ? { ...c, count: c.count + 1 } : c));
  };

  const toggleFavorite = (id) => {
    setCuriosities(prev => prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c));
  };

  const addCollection = (name, color, emoji, note) => {
    const id = "col" + Date.now();
    setCollections(prev => [...prev, { id, name, color: color || "#a8842c", emoji: emoji || "✦", note: note || "", count: 0, pinned: false }]);
    return id;
  };

  const updateCollection = (id, patch) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  const removeCollection = (id) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    setCuriosities(prev => prev.map(c => c.collection === id ? { ...c, collection: null } : c));
  };

  const togglePinCollection = (id) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  };

  const resetAll = () => {
    setCuriosities(window.SEED.curiosities);
    setCollections(window.SEED.collections);
  };

  return {
    curiosities, collections, sortBy, view,
    setSortBy, setView,
    addCuriosity, updateCuriosity, removeCuriosity, duplicateCuriosity, toggleFavorite,
    addCollection, updateCollection, removeCollection, togglePinCollection,
    resetAll,
  };
}

window.useStore = useStore;
