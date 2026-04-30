// ── Explore (search + filter) ───────────────────────────────────────────────
function ExplorePage({ store, theme, search, onSearch, onOpenItem }) {
  const { curiosities, sortBy, setSortBy, view, setView } = store;
  const [moods, setMoods] = React.useState([]);
  const [cats, setCats] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [favOnly, setFavOnly] = React.useState(false);

  // Aggregate tag cloud
  const tagCounts = React.useMemo(() => {
    const m = {};
    curiosities.forEach(c => (c.tags || []).forEach(t => m[t] = (m[t] || 0) + 1));
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [curiosities]);

  const filtered = React.useMemo(() => {
    let list = curiosities;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q) ||
        (c.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (moods.length) list = list.filter(c => moods.includes(c.mood));
    if (cats.length) list = list.filter(c => cats.includes(c.category));
    if (tags.length) list = list.filter(c => (c.tags || []).some(t => tags.includes(t)));
    if (favOnly) list = list.filter(c => c.favorite);
    list = [...list].sort((a, b) => {
      if (sortBy === "newest") return a.added < b.added ? 1 : -1;
      if (sortBy === "oldest") return a.added > b.added ? 1 : -1;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });
    return list;
  }, [curiosities, search, moods, cats, tags, favOnly, sortBy]);

  const toggleIn = (arr, val, set) => set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 32px 80px" }}>
      <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 8 }}>Explore the archive</div>
      <h1 style={{ fontStyle: "italic", color: "var(--ink)", marginBottom: 28 }}>{filtered.length} oddments by hand and chance</h1>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 32 }}>
        {/* Sidebar filters */}
        <aside style={{ position: "sticky", top: 100, alignSelf: "start", maxHeight: "calc(100vh - 120px)", overflow: "auto", paddingRight: 8 }}>
          <FilterGroup label="Mood">
            {window.SEED.moods.map(m => (
              <FilterCheck key={m} label={m} checked={moods.includes(m)} onClick={() => toggleIn(moods, m, setMoods)} dot={MOOD_COLORS[m]} />
            ))}
          </FilterGroup>
          <FilterGroup label="Category">
            {window.SEED.categories.map(c => (
              <FilterCheck key={c} label={c} checked={cats.includes(c)} onClick={() => toggleIn(cats, c, setCats)} />
            ))}
          </FilterGroup>
          <FilterGroup label="Tags">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {tagCounts.slice(0, 30).map(([t, n]) => (
                <Tag key={t} active={tags.includes(t)} onClick={() => toggleIn(tags, t, setTags)}>{t} · {n}</Tag>
              ))}
            </div>
          </FilterGroup>
          <FilterGroup label="Show only">
            <FilterCheck label="Favorites" checked={favOnly} onClick={() => setFavOnly(!favOnly)} />
          </FilterGroup>
          {(moods.length || cats.length || tags.length || favOnly) ? (
            <button onClick={() => { setMoods([]); setCats([]); setTags([]); setFavOnly(false); }}
              style={{ background: "transparent", border: 0, color: "var(--ink-2)", cursor: "pointer", padding: "6px 0", fontFamily: "var(--font-body)", fontSize: 14, textDecoration: "underline" }}>
              Clear filters
            </button>
          ) : null}
        </aside>

        {/* Results */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: "auto", paddingRight: 36, fontSize: 14 }}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title">Title (A→Z)</option>
              </Select>
            </div>
            <div style={{ display: "flex", gap: 2, border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 3, background: "var(--surface)" }}>
              {[["grid","LayoutGrid"],["shelf","Rows3"],["list","List"]].map(([v, ic]) => (
                <button key={v} onClick={() => setView(v)} style={{
                  width: 32, height: 32, border: 0, cursor: "pointer", borderRadius: "calc(var(--radius) - 3px)",
                  background: view === v ? "var(--card)" : "transparent",
                  color: view === v ? "var(--ink)" : "var(--ink-2)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  boxShadow: view === v ? "var(--shadow-sm)" : "none",
                  transition: "all 120ms ease",
                }}>
                  <Icon name={ic} size={15} />
                </button>
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: 80, textAlign: "center", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)" }}>
              <h3 style={{ color: "var(--ink-2)", fontStyle: "italic", marginBottom: 8 }}>Nothing matches.</h3>
              <p className="small dim">Try clearing some filters, or adjust your search.</p>
            </div>
          ) : view === "list" ? (
            <ListView items={filtered} onOpenItem={onOpenItem} store={store} />
          ) : view === "shelf" ? (
            <ShelfView items={filtered} onOpenItem={onOpenItem} store={store} theme={theme} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {filtered.map(item => (
                <CuriosityCard key={item.id} item={item} theme={theme} onClick={() => onOpenItem(item)} onFav={() => store.toggleFavorite(item.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{children}</div>
    </div>
  );
}

function FilterCheck({ label, checked, onClick, dot }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 8,
      background: "transparent", border: 0, padding: "4px 0",
      cursor: "pointer", color: "var(--ink-2)",
      fontFamily: "var(--font-body)", fontSize: 14, textAlign: "left",
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: 3,
        border: "1px solid " + (checked ? "var(--ink)" : "var(--border-2)"),
        background: checked ? "var(--ink)" : "transparent",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        color: "var(--card)",
      }}>
        {checked && <Icon name="Check" size={10} stroke={2.4} />}
      </span>
      {dot && <span style={{ width: 8, height: 8, borderRadius: 999, background: dot }} />}
      <span style={{ textTransform: "capitalize" }}>{label}</span>
    </button>
  );
}

function ListView({ items, onOpenItem, store }) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      {items.map((item, idx) => (
        <div key={item.id} onClick={() => onOpenItem(item)}
          style={{
            display: "grid", gridTemplateColumns: "60px 1fr auto auto auto", alignItems: "center", gap: 16,
            padding: "12px 16px",
            borderTop: idx === 0 ? 0 : "1px solid var(--border)",
            cursor: "pointer", transition: "background 120ms ease",
          }}
          onMouseOver={e => e.currentTarget.style.background = "var(--surface)"}
          onMouseOut={e => e.currentTarget.style.background = "transparent"}>
          <div style={{ width: 56, height: 56, borderRadius: 6, overflow: "hidden", background: "var(--bg-2)" }}>
            <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--ink)" }}>{item.title}</div>
            <div className="small dim" style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</div>
          </div>
          <MoodPill mood={item.mood} size="sm" />
          <span className="mono" style={{ color: "var(--ink-3)" }}>{new Date(item.added).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}</span>
          <button onClick={(e) => { e.stopPropagation(); store.toggleFavorite(item.id); }}
            style={{ background: "transparent", border: 0, cursor: "pointer", color: item.favorite ? "var(--accent-2)" : "var(--ink-3)", padding: 4 }}>
            <Icon name="Star" size={14} style={{ fill: item.favorite ? "var(--accent-2)" : "transparent" }} />
          </button>
        </div>
      ))}
    </div>
  );
}

function ShelfView({ items, onOpenItem, store, theme }) {
  // Group by category
  const byCat = items.reduce((acc, c) => {
    (acc[c.category] = acc[c.category] || []).push(c);
    return acc;
  }, {});
  return (
    <div>
      {Object.entries(byCat).map(([cat, list]) => (
        <div key={cat} style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <h3 style={{ fontStyle: "italic", color: "var(--ink)", textTransform: "capitalize" }}>{cat}</h3>
            <span className="mono" style={{ color: "var(--ink-3)" }}>{list.length} items</span>
          </div>
          {/* Shelf board */}
          <div style={{ position: "relative", paddingBottom: 14 }}>
            <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 12 }}>
              {list.map(item => (
                <div key={item.id} onClick={() => onOpenItem(item)} style={{ flex: "0 0 180px", cursor: "pointer" }}
                  onMouseOver={e => e.currentTarget.style.transform = "translateY(-3px)"}
                  onMouseOut={e => e.currentTarget.style.transform = ""}>
                  <div style={{ aspectRatio: "3/4", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--bg-2)", border: "1px solid var(--border)", marginBottom: 8 }}>
                    <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ fontSize: 14, fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--ink)", lineHeight: 1.2, marginBottom: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</div>
                  <MoodPill mood={item.mood} size="sm" />
                </div>
              ))}
            </div>
            {/* Wooden shelf line */}
            <div style={{ height: 6, background: "linear-gradient(180deg, var(--border-2), var(--border))", borderRadius: 2, boxShadow: "0 4px 8px -3px rgba(0,0,0,.15)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Stats ───────────────────────────────────────────────────────────────────
function StatsPage({ store, theme }) {
  const { curiosities, collections } = store;
  const moodCounts = {};
  curiosities.forEach(c => moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1);
  const moodEntries = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  const maxMood = Math.max(...moodEntries.map(([, n]) => n), 1);

  const catCounts = {};
  curiosities.forEach(c => catCounts[c.category] = (catCounts[c.category] || 0) + 1);
  const catEntries = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...catEntries.map(([, n]) => n), 1);

  const collectionCounts = collections.map(c => ({ ...c, count: curiosities.filter(x => x.collection === c.id).length })).sort((a, b) => b.count - a.count);

  // Activity over last 12 months
  const now = new Date();
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7);
    const label = d.toLocaleDateString("en-US", { month: "short" });
    const count = curiosities.filter(c => (c.added || "").startsWith(key)).length;
    months.push({ key, label, count });
  }
  const maxMonth = Math.max(...months.map(m => m.count), 1);

  // Most-nostalgic month (mood = nostalgic)
  const nostalgicMonth = (() => {
    const m = {};
    curiosities.filter(c => c.mood === "nostalgic").forEach(c => {
      const k = (c.added || "").slice(0, 7);
      m[k] = (m[k] || 0) + 1;
    });
    const top = Object.entries(m).sort((a, b) => b[1] - a[1])[0];
    if (!top) return "—";
    const [y, mo] = top[0].split("-");
    return new Date(y, parseInt(mo) - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  })();

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 32px 80px" }}>
      <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 8 }}>The Ledger</div>
      <h1 style={{ fontStyle: "italic", color: "var(--ink)", marginBottom: 36 }}>An archive in numbers</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 36 }}>
        <Card style={{ padding: 28 }}>
          <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 16 }}>Activity · last 12 months</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 200 }}>
            {months.map(m => (
              <div key={m.key} title={m.count + " items"} style={{
                flex: 1, position: "relative",
                height: m.count ? (m.count / maxMonth * 100) + "%" : "3px",
                background: m.count ? "linear-gradient(to top, var(--accent), var(--accent-2))" : "var(--bg-2)",
                borderRadius: "4px 4px 2px 2px", transition: "height 200ms ease",
              }}>
                {m.count > 0 && <span style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: "var(--ink-2)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>{m.count}</span>}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
            {months.map(m => (
              <div key={m.key} style={{ flex: 1, textAlign: "center" }}>
                <span className="mono" style={{ color: "var(--ink-3)", fontSize: 9 }}>{m.label}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding: 28 }}>
          <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 16 }}>Most common moods</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {moodEntries.map(([mood, n]) => (
              <div key={mood} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 100, fontSize: 14, color: "var(--ink-2)", textTransform: "capitalize", fontStyle: "italic" }}>{mood}</div>
                <div style={{ flex: 1, height: 14, background: "var(--surface)", borderRadius: 3, overflow: "hidden", position: "relative", border: "1px solid var(--border)" }}>
                  <div style={{ width: (n / maxMood * 100) + "%", height: "100%", background: MOOD_COLORS[mood] || "var(--accent)", transition: "width 400ms ease" }} />
                </div>
                <div className="mono" style={{ color: "var(--ink-3)", width: 24, textAlign: "right" }}>{n}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 36 }}>
        <StatCard kicker="Most nostalgic month" value={nostalgicMonth} label="" />
        <StatCard kicker="Largest cabinet" value={collectionCounts[0]?.name || "—"} label={collectionCounts[0]?.count + " items"} />
        <StatCard kicker="Average per cabinet" value={Math.round(curiosities.length / Math.max(1, collections.length))} label="curiosities" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card style={{ padding: 28 }}>
          <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 16 }}>Categories</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {catEntries.map(([cat, n]) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 90, fontSize: 14, color: "var(--ink-2)", textTransform: "capitalize", fontStyle: "italic" }}>{cat}</div>
                <div style={{ flex: 1, height: 10, background: "var(--bg-2)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: (n / maxCat * 100) + "%", height: "100%", background: "linear-gradient(to right, var(--accent), var(--accent-2))" }} />
                </div>
                <div className="mono" style={{ color: "var(--ink-3)", width: 24, textAlign: "right" }}>{n}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding: 28 }}>
          <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 16 }}>Cabinets by size</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {collectionCounts.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 14, height: 14, borderRadius: 4, background: c.color, display: "inline-block" }} />
                <div style={{ flex: 1, fontSize: 14, fontStyle: "italic", color: "var(--ink)" }}>{c.name}</div>
                <span className="mono" style={{ color: "var(--ink-3)" }}>{c.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}


Object.assign(window, { ExplorePage, FilterGroup, FilterCheck, ListView, ShelfView, StatsPage });
