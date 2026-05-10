// app.jsx — top-level Oddments app

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "aurora",
  "mode": "light"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const store = useStore();

  const [page, setPage] = React.useState("dashboard");
  const [search, setSearch] = React.useState("");
  const [openItem, setOpenItem] = React.useState(null);
  const [openCollection, setOpenCollection] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [colModalOpen, setColModalOpen] = React.useState(false);
  const [editingCollection, setEditingCollection] = React.useState(null);

  // Apply theme to <body>
  React.useEffect(() => {
    document.body.dataset.theme = tweaks.theme;
    document.body.dataset.mode = tweaks.mode;
  }, [tweaks.theme, tweaks.mode]);

  // Keyboard: cmd/ctrl-K focus search, R for random
  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPage("explore");
        setTimeout(() => {
          const inp = document.querySelector('input[type="text"]');
          if (inp) inp.focus();
        }, 50);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openItemAndPage = (item) => {
    setOpenItem(item);
    setOpenCollection(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const openCollectionAndPage = (col) => {
    setOpenCollection(col);
    setOpenItem(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleRandom = () => {
    if (!store.curiosities.length) return;
    const item = store.curiosities[Math.floor(Math.random() * store.curiosities.length)];
    openItemAndPage(item);
  };

  // Sync openItem/openCollection with store changes (in case it was edited)
  const syncedItem = openItem ? store.curiosities.find(c => c.id === openItem.id) : null;
  const syncedCollection = openCollection ? store.collections.find(c => c.id === openCollection.id) : null;

  // Determine current view
  let viewEl = null;
  if (syncedItem) {
    viewEl = <CuriosityDetail
      item={syncedItem} store={store} theme={tweaks.theme}
      onBack={() => { setOpenItem(null); window.scrollTo({ top: 0, behavior: "instant" }); }}
      onEdit={() => { setEditing(syncedItem); setAddOpen(true); }}
      onDelete={() => { if (confirm("Remove this curiosity from the archive?")) { store.removeCuriosity(syncedItem.id); setOpenItem(null); } }}
      onDuplicate={() => store.duplicateCuriosity(syncedItem.id)}
      onOpenItem={openItemAndPage}
      onTag={(t) => { setOpenItem(null); setPage("explore"); setSearch(t); }}
      onMood={(m) => { setOpenItem(null); setPage("explore"); }}
    />;
  } else if (syncedCollection) {
    viewEl = <CollectionDetail
      collection={syncedCollection} store={store} theme={tweaks.theme}
      onBack={() => { setOpenCollection(null); window.scrollTo({ top: 0, behavior: "instant" }); }}
      onOpenItem={openItemAndPage}
      onEdit={() => { setEditingCollection(syncedCollection); setColModalOpen(true); }}
      onDelete={() => { if (confirm("Delete this cabinet? Its curiosities will become unfiled.")) { store.removeCollection(syncedCollection.id); setOpenCollection(null); } }}
    />;
  } else if (page === "dashboard") {
    viewEl = <Dashboard store={store} theme={tweaks.theme}
      onOpenItem={openItemAndPage}
      onOpenCollection={openCollectionAndPage}
      onAdd={() => { setEditing(null); setAddOpen(true); }} />;
  } else if (page === "collections") {
    viewEl = <CollectionsPage store={store} theme={tweaks.theme}
      onOpenCollection={openCollectionAndPage}
      onNewCollection={() => { setEditingCollection(null); setColModalOpen(true); }} />;
  } else if (page === "explore") {
    viewEl = <ExplorePage store={store} theme={tweaks.theme} search={search} onSearch={setSearch} onOpenItem={openItemAndPage} />;
  } else if (page === "stats") {
    viewEl = <StatsPage store={store} theme={tweaks.theme} />;
  }

  if (store.loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--ink-3)", fontFamily: "var(--font-body)", fontSize: "1.1rem", letterSpacing: "0.04em" }}>
        Loading archive…
      </div>
    );
  }

  return (
    <div className="app">
      <NavBar
        page={page}
        onNavigate={(p) => { setOpenItem(null); setOpenCollection(null); setPage(p); window.scrollTo({ top: 0, behavior: "instant" }); }}
        onAdd={() => { setEditing(null); setAddOpen(true); }}
        onRandom={handleRandom}
        search={search}
        onSearch={(v) => { setSearch(v); if (v && page !== "explore") setPage("explore"); }}
      />
      {viewEl}

      <AddCuriosityModal
        open={addOpen} onClose={() => { setAddOpen(false); setEditing(null); }}
        initial={editing}
        store={store}
        onSubmit={(form) => {
          if (editing) {
            store.updateCuriosity(editing.id, form);
          } else {
            const id = store.addCuriosity(form);
          }
          setAddOpen(false); setEditing(null);
        }}
      />

      <CollectionModal
        open={colModalOpen} onClose={() => { setColModalOpen(false); setEditingCollection(null); }}
        initial={editingCollection}
        onSubmit={(form) => {
          if (editingCollection) store.updateCollection(editingCollection.id, form);
          else store.addCollection(form.name, form.color, form.emoji, form.note);
          setColModalOpen(false); setEditingCollection(null);
        }}
      />

      <Footer onReset={() => { if (confirm("Reset to seed data? Your changes will be lost.")) store.resetAll(); }} />

      <button
        onClick={() => setTweak("mode", tweaks.mode === "light" ? "dark" : "light")}
        title={tweaks.mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 200,
          width: 48, height: 48, borderRadius: 999,
          background: "var(--card)", border: "0.5px solid var(--border)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "var(--shadow-md)",
          color: "var(--ink)", transition: "all 140ms ease",
        }}
        onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseOut={e => e.currentTarget.style.transform = ""}
      >
        <Icon name={tweaks.mode === "dark" ? "Sun" : "Moon"} size={20} />
      </button>
    </div>
  );
}

function Footer({ onReset }) {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "32px", marginTop: 40 }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontStyle: "italic", color: "var(--ink)", fontFamily: "var(--font-display)", fontSize: 22 }}>Oddments</div>
          <div className="small dim">A digital cabinet of curiosities · Saved locally to this device</div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span className="mono" style={{ color: "var(--ink-3)" }}>v1.0 · est. 2026</span>
          <button onClick={onReset} style={{ background: "transparent", border: 0, color: "var(--ink-3)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, textDecoration: "underline" }}>Reset archive</button>
        </div>
      </div>
    </footer>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
