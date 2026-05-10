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
  const [apiMode, setApiMode] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  // Persist to localStorage (only in offline mode — API is the source of truth when online)
  React.useEffect(() => {
    if (!apiMode) saveToLS({ curiosities, collections, sortBy, view });
  }, [curiosities, collections, sortBy, view, apiMode]);

  // Probe the API on mount; hydrate from it if reachable
  React.useEffect(() => {
    if (!window.API) { setLoading(false); return; }
    window.API.probe().then(async (online) => {
      if (!online) { setLoading(false); return; }
      try {
        const [cRes, colRes] = await Promise.all([
          window.API.getCuriosities({ limit: 100 }),
          window.API.getCollections({ limit: 100 }),
        ]);
        setCuriosities(cRes.data);
        setCollections(colRes.data);
        setApiMode(true);
      } catch (e) {
        // Fall back to localStorage silently
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Helpers
  const addCuriosity = async (item) => {
    if (apiMode) {
      try {
        const created = await window.API.createCuriosity(item);
        setCuriosities(prev => [created, ...prev]);
        setCollections(prev => prev.map(c => c.id === created.collection ? { ...c, count: c.count + 1 } : c));
        return created.id;
      } catch (e) { console.error('API addCuriosity failed', e); }
    }
    const id = "c" + Date.now();
    const newItem = { id, added: new Date().toISOString().slice(0, 10), favorite: false, ...item };
    setCuriosities(prev => [newItem, ...prev]);
    setCollections(prev => prev.map(c => c.id === newItem.collection ? { ...c, count: c.count + 1 } : c));
    return id;
  };

  const updateCuriosity = async (id, patch) => {
    if (apiMode) {
      try {
        const updated = await window.API.updateCuriosity(id, patch);
        setCuriosities(prev => prev.map(c => c.id === id ? updated : c));
        return;
      } catch (e) { console.error('API updateCuriosity failed', e); }
    }
    setCuriosities(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  const removeCuriosity = async (id) => {
    const item = curiosities.find(c => c.id === id);
    if (apiMode) {
      try {
        await window.API.deleteCuriosity(id);
        setCuriosities(prev => prev.filter(c => c.id !== id));
        if (item) setCollections(prev => prev.map(c => c.id === item.collection ? { ...c, count: Math.max(0, c.count - 1) } : c));
        return;
      } catch (e) { console.error('API removeCuriosity failed', e); }
    }
    setCuriosities(prev => prev.filter(c => c.id !== id));
    if (item) setCollections(prev => prev.map(c => c.id === item.collection ? { ...c, count: Math.max(0, c.count - 1) } : c));
  };

  const duplicateCuriosity = async (id) => {
    const item = curiosities.find(c => c.id === id);
    if (!item) return;
    const dupData = { ...item, title: item.title + " — copy", favorite: false };
    delete dupData.id;
    delete dupData.added;
    if (apiMode) {
      try {
        const created = await window.API.createCuriosity(dupData);
        setCuriosities(prev => [created, ...prev]);
        setCollections(prev => prev.map(c => c.id === created.collection ? { ...c, count: c.count + 1 } : c));
        return;
      } catch (e) { console.error('API duplicateCuriosity failed', e); }
    }
    const dup = { ...item, id: "c" + Date.now(), title: item.title + " — copy", favorite: false, added: new Date().toISOString().slice(0, 10) };
    setCuriosities(prev => [dup, ...prev]);
    setCollections(prev => prev.map(c => c.id === dup.collection ? { ...c, count: c.count + 1 } : c));
  };

  const toggleFavorite = async (id) => {
    const item = curiosities.find(c => c.id === id);
    if (!item) return;
    if (apiMode) {
      try {
        const updated = await window.API.updateCuriosity(id, { favorite: !item.favorite });
        setCuriosities(prev => prev.map(c => c.id === id ? { ...c, favorite: updated.favorite } : c));
        return;
      } catch (e) { console.error('API toggleFavorite failed', e); }
    }
    setCuriosities(prev => prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c));
  };

  const addCollection = async (name, color, emoji, note) => {
    if (apiMode) {
      try {
        const created = await window.API.createCollection({ name, color: color || "#a8842c", emoji: emoji || "✦", note: note || "", pinned: false });
        setCollections(prev => [...prev, created]);
        return created.id;
      } catch (e) { console.error('API addCollection failed', e); }
    }
    const id = "col" + Date.now();
    setCollections(prev => [...prev, { id, name, color: color || "#a8842c", emoji: emoji || "✦", note: note || "", count: 0, pinned: false }]);
    return id;
  };

  const updateCollection = async (id, patch) => {
    if (apiMode) {
      try {
        const updated = await window.API.updateCollection(id, patch);
        setCollections(prev => prev.map(c => c.id === id ? updated : c));
        return;
      } catch (e) { console.error('API updateCollection failed', e); }
    }
    setCollections(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  const removeCollection = async (id) => {
    if (apiMode) {
      try {
        await window.API.deleteCollection(id);
        setCollections(prev => prev.filter(c => c.id !== id));
        setCuriosities(prev => prev.map(c => c.collection === id ? { ...c, collection: null } : c));
        return;
      } catch (e) { console.error('API removeCollection failed', e); }
    }
    setCollections(prev => prev.filter(c => c.id !== id));
    setCuriosities(prev => prev.map(c => c.collection === id ? { ...c, collection: null } : c));
  };

  const togglePinCollection = async (id) => {
    const col = collections.find(c => c.id === id);
    if (!col) return;
    if (apiMode) {
      try {
        const updated = await window.API.updateCollection(id, { pinned: !col.pinned });
        setCollections(prev => prev.map(c => c.id === id ? updated : c));
        return;
      } catch (e) { console.error('API togglePinCollection failed', e); }
    }
    setCollections(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  };

  const resetAll = () => {
    setCuriosities(window.SEED.curiosities);
    setCollections(window.SEED.collections);
  };

  return {
    curiosities, collections, sortBy, view,
    loading, apiMode,
    setSortBy, setView,
    addCuriosity, updateCuriosity, removeCuriosity, duplicateCuriosity, toggleFavorite,
    addCollection, updateCollection, removeCollection, togglePinCollection,
    resetAll,
  };
}

window.useStore = useStore;
