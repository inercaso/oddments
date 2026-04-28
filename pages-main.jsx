// pages.jsx — page-level views: Dashboard, Collections, Detail, Explore, Stats

// ── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({ store, theme, onOpenItem, onOpenCollection, onAdd }) {
  const { curiosities, collections, toggleFavorite } = store;
  const recent = [...curiosities].sort((a, b) => (a.added < b.added ? 1 : -1)).slice(0, 6);
  const favorites = curiosities.filter(c => c.favorite);
  const pinned = collections.filter(c => c.pinned);

  // Most-used tag
  const tagCounts = {};
  curiosities.forEach(c => (c.tags || []).forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1));
  const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];

  // Most-used mood
  const moodCounts = {};
  curiosities.forEach(c => moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1);
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  // "Collection of the week" — pseudo-random but stable per week
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const cotw = collections[week % collections.length];

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 32px 80px" }}>
      {/* Hero */}
      <div style={{ marginBottom: 56, display: "grid", gridTemplateColumns: "minmax(0,1fr) 280px", gap: 32, alignItems: "stretch" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 320 }}>
          <div>
            <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 12 }}>The Hall · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
            <h1 style={{ fontStyle: "italic", color: "var(--ink)", lineHeight: 1, marginBottom: 18 }}>
              Welcome back to your<br/>cabinet of <span style={{ color: "var(--accent-2)" }}>curiosities.</span>
            </h1>
            <p style={{ fontSize: 18, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 580 }}>
              {curiosities.length} oddments arranged across {collections.length} cabinets. The newest is <em style={{ color: "var(--ink)" }}>"{recent[0]?.title}"</em>, added {recent[0] && new Date(recent[0].added).toLocaleDateString("en-US", { month: "long", day: "numeric" })}.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
            <Button variant="secondary" icon="Shuffle" onClick={() => onOpenItem(curiosities[Math.floor(Math.random() * curiosities.length)])}>Random</Button>
            <Button variant="primary" icon="Plus" onClick={onAdd}>Add curiosity</Button>
          </div>
        </div>
        <div style={{ position: "relative", alignSelf: "stretch", minHeight: 320 }}>
          {/* Botanical stems — straight, filling gap left of blob, rooted at stat strip level */}
          <div style={{
            position: "absolute", left: -318, top: 160, width: 302, bottom: -62,
            zIndex: 0, pointerEvents: "none", opacity: 0.72,
          }}>
            <svg viewBox="0 -40 320 240" preserveAspectRatio="xMidYMax meet" style={{ width: "100%", height: "100%" }}>
              {/* Stem 1 — center, S-curve, curled tip */}
              <path d="M120 390 C165 358 72 308 118 260 C164 212 76 166 118 118 C160 70 80 38 112 -8 C118 -22 132 -24 128 -12 C124 -2 112 -4 114 -16" fill="none" stroke="#8c4ba0" strokeWidth="5.5" strokeLinecap="round"/>
              {/* Stem 2 — left, curled tip */}
              <path d="M68 395 C108 362 35 316 68 270 C101 224 40 180 68 136 C96 92 42 60 62 18 C68 4 80 2 78 14 C76 26 64 24 64 12" fill="none" stroke="#8c4ba0" strokeWidth="4.5" strokeLinecap="round"/>
              {/* Stem 3 — right, curled tip */}
              <path d="M184 385 C220 352 152 306 184 260 C216 214 158 170 186 126 C214 82 162 50 182 10 C188 -4 200 -6 198 8 C196 22 184 20 184 6" fill="none" stroke="#8c4ba0" strokeWidth="4" strokeLinecap="round"/>
              {/* Stem 4 — thin far left, curled tip */}
              <path d="M22 400 C56 368 6 326 28 286 C50 246 8 208 28 170 C48 132 10 102 26 68 C30 56 40 54 38 66 C36 76 26 76 26 64" fill="none" stroke="#b97ad0" strokeWidth="3.2" strokeLinecap="round"/>
              {/* Stem 5 — thin mid, curled tip */}
              <path d="M110 400 C148 366 84 322 112 278 C140 234 86 192 112 150 C138 108 90 78 108 38 C112 26 122 24 120 36 C118 48 108 46 108 34" fill="none" stroke="#b97ad0" strokeWidth="3.5" strokeLinecap="round"/>
              {/* Stem 6 — right shorter, curled tip */}
              <path d="M248 388 C276 358 234 322 252 288 C270 254 234 222 252 190 C270 158 238 132 252 104 C256 94 264 92 262 102 C260 112 251 111 252 100" fill="none" stroke="#b97ad0" strokeWidth="3" strokeLinecap="round"/>
              {/* Branches */}
              <path d="M118 260 C140 246 162 240 176 230" fill="none" stroke="#8c4ba0" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M118 118 C142 104 162 96 175 86" fill="none" stroke="#8c4ba0" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M68 270 C46 254 28 244 12 236" fill="none" stroke="#b97ad0" strokeWidth="2" strokeLinecap="round"/>
              <path d="M68 136 C48 120 32 112 16 104" fill="none" stroke="#b97ad0" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M184 260 C206 246 226 240 242 230" fill="none" stroke="#8c4ba0" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M186 126 C208 112 226 106 240 96" fill="none" stroke="#8c4ba0" strokeWidth="2" strokeLinecap="round"/>
              <path d="M112 278 C132 264 150 256 164 246" fill="none" stroke="#b97ad0" strokeWidth="2" strokeLinecap="round"/>
              <path d="M28 170 C10 156 -2 146 -14 138" fill="none" stroke="#b97ad0" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M252 190 C270 176 284 168 296 160" fill="none" stroke="#b97ad0" strokeWidth="1.8" strokeLinecap="round"/>
              {/* Leaves */}
              <ellipse cx="176" cy="230" rx="28" ry="13" fill="#8c4ba0" opacity="0.6" transform="rotate(-38 176 230)"/>
              <ellipse cx="175" cy="86" rx="24" ry="11" fill="#b97ad0" opacity="0.56" transform="rotate(-44 175 86)"/>
              <ellipse cx="12" cy="236" rx="20" ry="9" fill="#c2c0e2" opacity="0.5" transform="rotate(22 12 236)"/>
              <ellipse cx="16" cy="104" rx="17" ry="8" fill="#b97ad0" opacity="0.48" transform="rotate(20 16 104)"/>
              <ellipse cx="242" cy="230" rx="26" ry="12" fill="#8c4ba0" opacity="0.55" transform="rotate(-32 242 230)"/>
              <ellipse cx="240" cy="96" rx="22" ry="10" fill="#b97ad0" opacity="0.52" transform="rotate(-30 240 96)"/>
              <ellipse cx="164" cy="246" rx="21" ry="10" fill="#b97ad0" opacity="0.5" transform="rotate(-36 164 246)"/>
              <ellipse cx="-14" cy="138" rx="16" ry="7.5" fill="#c2c0e2" opacity="0.44" transform="rotate(16 -14 138)"/>
              <ellipse cx="296" cy="160" rx="17" ry="8" fill="#b97ad0" opacity="0.46" transform="rotate(-22 296 160)"/>
              {/* Flowers at stem tips */}
              <circle cx="112" cy="-18" r="11" fill="#c2c0e2" opacity="0.68"/>
              <circle cx="97" cy="-18" r="8" fill="#d8d6f0" opacity="0.5"/>
              <circle cx="127" cy="-18" r="8" fill="#d8d6f0" opacity="0.5"/>
              <circle cx="112" cy="-30" r="9" fill="#c2c0e2" opacity="0.62"/>
              <circle cx="112" cy="-18" r="6.5" fill="#443268" opacity="0.82"/>
              <circle cx="62" cy="9" r="10" fill="#c2c0e2" opacity="0.7"/>
              <circle cx="49" cy="9" r="6.5" fill="#d8d6f0" opacity="0.52"/>
              <circle cx="75" cy="9" r="6.5" fill="#d8d6f0" opacity="0.52"/>
              <circle cx="62" cy="-2" r="8.5" fill="#c2c0e2" opacity="0.65"/>
              <circle cx="62" cy="9" r="5.5" fill="#443268" opacity="0.8"/>
              <circle cx="182" cy="2" r="9" fill="#c2c0e2" opacity="0.67"/>
              <circle cx="171" cy="2" r="6" fill="#d8d6f0" opacity="0.5"/>
              <circle cx="193" cy="2" r="6" fill="#d8d6f0" opacity="0.5"/>
              <circle cx="182" cy="-8" r="7.5" fill="#c2c0e2" opacity="0.62"/>
              <circle cx="182" cy="2" r="5" fill="#443268" opacity="0.78"/>
              <circle cx="26" cy="60" r="7" fill="#c2c0e2" opacity="0.58"/>
              <circle cx="26" cy="50" r="5.5" fill="#d8d6f0" opacity="0.5"/>
              <circle cx="26" cy="60" r="4" fill="#443268" opacity="0.72"/>
              <circle cx="108" cy="30" r="7.5" fill="#c2c0e2" opacity="0.6"/>
              <circle cx="98" cy="30" r="5" fill="#d8d6f0" opacity="0.5"/>
              <circle cx="118" cy="30" r="5" fill="#d8d6f0" opacity="0.5"/>
              <circle cx="108" cy="30" r="4.5" fill="#443268" opacity="0.75"/>
            </svg>
          </div>

          {/* Stars — further left */}
          <span aria-hidden="true" style={{ position: "absolute", left: -108, top: 22, color: "var(--accent)", opacity: 0.62, fontSize: 24, pointerEvents: "none", userSelect: "none", zIndex: 3 }}>✦</span>
          <span aria-hidden="true" style={{ position: "absolute", left: -72, top: 80, color: "var(--accent-2)", opacity: 0.28, fontSize: 10, pointerEvents: "none", userSelect: "none", zIndex: 3 }}>✦</span>
          <span aria-hidden="true" style={{ position: "absolute", left: -96, top: 152, color: "var(--accent)", opacity: 0.4, fontSize: 15, pointerEvents: "none", userSelect: "none", zIndex: 3 }}>✦</span>
          <span aria-hidden="true" style={{ position: "absolute", left: -84, top: 244, color: "var(--accent-2)", opacity: 0.32, fontSize: 12, pointerEvents: "none", userSelect: "none", zIndex: 3 }}>✦</span>
          <span aria-hidden="true" style={{ position: "absolute", left: -114, top: 308, color: "var(--accent)", opacity: 0.22, fontSize: 9, pointerEvents: "none", userSelect: "none", zIndex: 3 }}>✦</span>

          {/* Photo blob — vine.png on top of stems */}
          <div className="vine-blob" style={{
            position: "absolute", inset: 0, zIndex: 1,
            borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
            overflow: "hidden",
            background: "linear-gradient(160deg, var(--bg-2), var(--accent-2))",
          }}>
            <img src="assets/vine.png" alt="" onError={e => { e.target.style.display = "none"; }} style={{
              width: "100%", height: "100%", objectFit: "cover", objectPosition: "center right",
              mixBlendMode: "multiply", opacity: 0.95,
            }} />
          </div>

        </div>
      </div>

      {/* Stat strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 56 }}>
        <StatCard kicker="Total" value={curiosities.length} label="oddments archived" />
        <StatCard kicker="Favorites" value={favorites.length} label="starred items" icon="Star" iconColor="var(--accent-2)" />
        <StatCard kicker="Most common mood" value={topMood ? topMood[0] : "—"} label={topMood ? topMood[1] + " items" : ""} />
        <StatCard kicker="Most-used tag" value={topTag ? "#" + topTag[0] : "—"} label={topTag ? topTag[1] + " items" : ""} />
      </div>

      {/* Recent additions */}
      <SectionHeading
        kicker="Most recent acquisitions"
        title="Newly catalogued"
        italic
        action={<Button variant="ghost" iconRight="ArrowRight" onClick={() => store.setView && store.setView("grid")}>See all</Button>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginBottom: 56 }}>
        {recent.map(item => (
          <CuriosityCard key={item.id} item={item} theme={theme} onClick={() => onOpenItem(item)} onFav={() => toggleFavorite(item.id)} />
        ))}
      </div>

      {/* Pinned cabinets + collection of the week */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, marginBottom: 24 }}>
        <div>
          <SectionHeading kicker="Pinned cabinets" title="Always at hand" italic />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {pinned.map(col => (
              <CollectionCard key={col.id} collection={col} theme={theme}
                onClick={() => onOpenCollection(col)}
                onPin={() => store.togglePinCollection(col.id)} />
            ))}
            {pinned.length === 0 && <div className="small dim" style={{ padding: 16, fontStyle: "italic" }}>Pin a cabinet from the Cabinets page to see it here.</div>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <SectionHeading kicker="Cabinet of the week" title={cotw?.name || ""} italic />
          {cotw && <FeaturedCollection collection={cotw} curiosities={curiosities.filter(c => c.collection === cotw.id)} onClick={() => onOpenCollection(cotw)} style={{ flex: 1 }} />}
        </div>
      </div>
    </div>
  );
}

function StatCard({ kicker, value, label, icon, iconColor }) {
  return (
    <Card style={{ padding: 20 }}>
      <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 6 }}>{kicker}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        {icon && <Icon name={icon} size={20} style={{ color: iconColor || "var(--accent)", alignSelf: "center" }} />}
        <div style={{ fontFamily: "var(--font-display)", fontSize: 38, color: "var(--ink)", lineHeight: 1, fontStyle: "italic" }}>{value}</div>
      </div>
      <div className="small" style={{ marginTop: 6, color: "var(--ink-2)" }}>{label}</div>
    </Card>
  );
}

function FeaturedCollection({ collection, curiosities, onClick, style = {} }) {
  return (
    <div onClick={onClick} style={{
      position: "relative", padding: 20,
      background: "color-mix(in oklab, " + collection.color + " 8%, var(--card))",
      border: "1px solid color-mix(in oklab, " + collection.color + " 25%, var(--border))",
      borderRadius: "var(--radius-lg)",
      cursor: "pointer", transition: "transform 200ms ease",
      display: "flex", flexDirection: "column",
      ...style,
    }}
    onMouseOver={e => e.currentTarget.style.transform = "translateY(-3px)"}
    onMouseOut={e => e.currentTarget.style.transform = ""}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 14 }}>
        {curiosities.slice(0, 6).map(c => (
          <div key={c.id} style={{ aspectRatio: "1", background: "var(--bg-2)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
            <img src={c.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
      <p className="small" style={{ color: "var(--ink-2)", margin: "0 0 10px", fontStyle: "italic" }}>"{collection.note}"</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        <span className="mono" style={{ color: "var(--ink-3)" }}>{curiosities.length} items</span>
        <Icon name="ArrowRight" size={14} style={{ color: collection.color }} />
      </div>
    </div>
  );
}

// ── Collections ─────────────────────────────────────────────────────────────
function CollectionsPage({ store, theme, onOpenCollection, onNewCollection }) {
  const { collections } = store;
  const [filter, setFilter] = React.useState("all");
  const filtered = filter === "pinned" ? collections.filter(c => c.pinned) : collections;

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 32px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
        <div>
          <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 8 }}>The Cabinets</div>
          <h1 style={{ fontStyle: "italic", color: "var(--ink)" }}>Collections</h1>
          <p className="small" style={{ color: "var(--ink-2)", marginTop: 12, fontSize: 16, maxWidth: 520 }}>
            Curated drawers and folios. Each cabinet is a theme — drag, pin, rename. Click a drawer to open it.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", gap: 2, border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 3, background: "var(--surface)" }}>
            {["all", "pinned"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "6px 14px", border: 0, fontSize: 14, cursor: "pointer",
                borderRadius: "calc(var(--radius) - 3px)",
                background: filter === f ? "var(--card)" : "transparent",
                color: filter === f ? "var(--ink)" : "var(--ink-2)",
                fontFamily: "var(--font-body)",
                fontWeight: filter === f ? 500 : 400,
                boxShadow: filter === f ? "var(--shadow-sm)" : "none",
                textTransform: "capitalize",
                transition: "all 120ms ease",
              }}>{f}</button>
            ))}
          </div>
          <Button variant="primary" icon="Plus" onClick={onNewCollection}>New cabinet</Button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {filtered.map(col => (
          <CollectionCard key={col.id} collection={col} theme={theme}
            onClick={() => onOpenCollection(col)}
            onPin={() => store.togglePinCollection(col.id)} />
        ))}
      </div>
    </div>
  );
}

// ── Collection Detail ───────────────────────────────────────────────────────
function CollectionDetail({ collection, store, theme, onBack, onOpenItem, onEdit, onDelete }) {
  const items = store.curiosities.filter(c => c.collection === collection.id);
  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "32px 32px 80px" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: 0, color: "var(--ink-2)", cursor: "pointer", marginBottom: 24, padding: 6, fontFamily: "var(--font-body)", fontSize: 14 }}>
        <Icon name="ArrowLeft" size={14} /> All cabinets
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "end", gap: 24, marginBottom: 36 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              background: "color-mix(in oklab, " + collection.color + " 18%, var(--card))",
              border: "1px solid color-mix(in oklab, " + collection.color + " 35%, transparent)",
              color: collection.color,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontFamily: "var(--font-display)",
            }}>{collection.emoji}</div>
            <div>
              <div className="mono" style={{ color: "var(--ink-3)" }}>Cabinet · {items.length} items</div>
              <h1 style={{ fontStyle: "italic", color: "var(--ink)", fontSize: 56 }}>{collection.name}</h1>
            </div>
          </div>
          <p style={{ fontSize: 17, color: "var(--ink-2)", fontStyle: "italic", maxWidth: 600 }}>"{collection.note}"</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" icon="Pin" onClick={() => store.togglePinCollection(collection.id)}>{collection.pinned ? "Unpin" : "Pin"}</Button>
          <Button variant="secondary" icon="Pencil" onClick={onEdit}>Edit</Button>
          <Button variant="danger" icon="Trash2" onClick={onDelete}>Delete</Button>
        </div>
      </div>
      {items.length === 0 ? (
        <div style={{ padding: 80, textAlign: "center", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)" }}>
          <Icon name="PackageOpen" size={32} style={{ color: "var(--ink-3)", marginBottom: 12 }} />
          <h3 style={{ color: "var(--ink-2)", fontStyle: "italic", marginBottom: 8 }}>This drawer is empty.</h3>
          <p className="small dim">Add a curiosity and assign it to "{collection.name}".</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {items.map(item => (
            <CuriosityCard key={item.id} item={item} theme={theme} onClick={() => onOpenItem(item)} onFav={() => store.toggleFavorite(item.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Curiosity Detail ────────────────────────────────────────────────────────
function CuriosityDetail({ item, store, theme, onBack, onEdit, onDelete, onDuplicate, onOpenItem, onTag, onMood }) {
  const collection = store.collections.find(c => c.id === item.collection);
  const related = store.curiosities
    .filter(c => c.id !== item.id && (c.mood === item.mood || c.collection === item.collection || (c.tags || []).some(t => (item.tags || []).includes(t))))
    .slice(0, 4);
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 80px" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: 0, color: "var(--ink-2)", cursor: "pointer", marginBottom: 24, padding: 6, fontFamily: "var(--font-body)", fontSize: 14 }}>
        <Icon name="ArrowLeft" size={14} /> Back
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 480px) 1fr", gap: 56, alignItems: "start" }}>
        {/* Image */}
        <div style={{ position: "sticky", top: 100 }}>
          <div className="img-stripes" style={{
            aspectRatio: "1", background: "var(--bg-2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-md)",
            overflow: "hidden", position: "relative",
          }}>
            <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{
              position: "absolute", top: -8, left: 40, transform: "rotate(-3deg)",
              width: 80, height: 22, background: "var(--tape)", boxShadow: "0 1px 3px rgba(0,0,0,.15)",
            }}/>
          </div>
          <div className="mono" style={{ marginTop: 12, color: "var(--ink-3)", textAlign: "center" }}>
            ID · {item.id} · {item.category}
          </div>
        </div>
        {/* Body */}
        <div>
          <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 8, display: "flex", gap: 12, alignItems: "center" }}>
            {collection && <span>From <span style={{ color: collection.color }}>{collection.name}</span></span>}
            <span>·</span>
            <MoodPill mood={item.mood} size="sm" />
            <span>·</span>
            <span>added {new Date(item.added).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <h1 style={{ fontStyle: "italic", color: "var(--ink)", marginBottom: 18, fontSize: 64, lineHeight: 1.05 }}>{item.title}</h1>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--ink-2)", marginBottom: 32, fontFamily: "var(--font-body)" }}>{item.description}</p>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
            <Button variant={item.favorite ? "accent" : "secondary"} icon="Star" onClick={() => store.toggleFavorite(item.id)}>{item.favorite ? "Favorited" : "Favorite"}</Button>
            <Button variant="secondary" icon="Pencil" onClick={onEdit}>Edit</Button>
            <Button variant="secondary" icon="Copy" onClick={onDuplicate}>Duplicate</Button>
            <Button variant="danger" icon="Trash2" onClick={onDelete}>Remove</Button>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 36 }}>
            <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 10 }}>Tags</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(item.tags || []).map(t => <Tag key={t} onClick={() => onTag(t)}># {t}</Tag>)}
              {(!item.tags || item.tags.length === 0) && <span className="small dim">No tags yet.</span>}
            </div>
          </div>

          {/* Provenance */}
          <div style={{ marginBottom: 36, padding: "14px 24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)", flexShrink: 0, boxShadow: "0 0 0 3px color-mix(in oklab, var(--accent) 25%, transparent)" }} />
            <span className="mono" style={{ color: "var(--ink-3)" }}>Provenance</span>
            <span style={{ color: "var(--border-2)" }}>·</span>
            <span style={{ fontStyle: "italic", color: "var(--ink)" }}>Added to archive</span>
            <span style={{ color: "var(--border-2)" }}>·</span>
            <span className="small dim">{new Date(item.added).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 10 }}>Adjacent oddments</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
                {related.map(r => (
                  <div key={r.id} onClick={() => onOpenItem(r)}
                    style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 12, cursor: "pointer", transition: "transform 160ms ease" }}
                    onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseOut={e => e.currentTarget.style.transform = ""}>
                    <div style={{ aspectRatio: "1", borderRadius: "var(--radius)", overflow: "hidden", marginBottom: 10, background: "var(--bg-2)" }}>
                      <img src={r.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ fontSize: 13, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



Object.assign(window, { Dashboard, StatCard, FeaturedCollection, CollectionsPage, CollectionDetail, CuriosityDetail });
