// ui.jsx — shared UI components for Oddments

const I = (props) => <Icon {...props} />;

// Button — shadcn-flavored, but with serif tone
function Button({ variant = "primary", size = "md", icon, iconRight, children, ...rest }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8,
    fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 500,
    border: "1px solid transparent", borderRadius: "var(--radius)",
    padding: size === "sm" ? "5px 11px" : size === "lg" ? "10px 20px" : "7px 14px",
    transition: "all 140ms ease", cursor: "pointer",
    letterSpacing: "0.005em", lineHeight: 1.2,
    whiteSpace: "nowrap",
  };
  const variants = {
    primary: { background: "var(--ink)", color: "var(--card)", borderColor: "var(--ink)" },
    secondary: { background: "var(--card)", color: "var(--ink)", borderColor: "var(--border)" },
    ghost: { background: "transparent", color: "var(--ink)", borderColor: "transparent" },
    accent: { background: "var(--accent)", color: "var(--card)", borderColor: "var(--accent)" },
    danger: { background: "transparent", color: "var(--accent-2)", borderColor: "var(--border)" },
  };
  return (
    <button
      className={"oc-btn oc-btn-" + variant}
      style={{ ...base, ...variants[variant] }}
      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
      onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
      {...rest}
    >
      {icon && <I name={icon} size={size === "sm" ? 13 : 15} />}
      {children}
      {iconRight && <I name={iconRight} size={size === "sm" ? 13 : 15} />}
    </button>
  );
}

// IconButton — square, icon-only
function IconButton({ icon, size = 32, active = false, title, ...rest }) {
  return (
    <button
      className="oc-iconbtn"
      title={title}
      style={{
        width: size, height: size,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--card)" : "var(--ink-2)",
        border: "1px solid " + (active ? "var(--ink)" : "var(--border)"),
        borderRadius: "var(--radius)",
        cursor: "pointer", transition: "all 140ms ease",
      }}
      onMouseOver={e => { if (!active) e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.color = "var(--ink)"; }}
      onMouseOut={e => { if (!active) e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = active ? "var(--card)" : "var(--ink-2)"; }}
      {...rest}
    >
      <I name={icon} size={Math.round(size * 0.5)} />
    </button>
  );
}

// Tag/Chip
function Tag({ children, onClick, active = false, removable = false, onRemove }) {
  return (
    <span
      onClick={onClick}
      className="oc-tag"
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 10px",
        fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: 0,
        border: "1px solid " + (active ? "var(--ink)" : "var(--border)"),
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--card)" : "var(--ink-2)",
        borderRadius: 999,
        cursor: onClick ? "pointer" : "default",
        transition: "all 120ms ease",
        whiteSpace: "nowrap",
      }}
    >
      {children}
      {removable && (
        <span onClick={(e) => { e.stopPropagation(); onRemove && onRemove(); }} style={{ cursor: "pointer", marginLeft: 2, opacity: 0.7 }}>
          <I name="X" size={10} />
        </span>
      )}
    </span>
  );
}

// Mood pill — with subtle color tint
const MOOD_COLORS = {
  nostalgic: "#B9AABF",
  cozy: "#C8B8C8",
  dreamy: "#A8B5C1",
  melancholic: "#3C3F4A",
  chaotic: "#A8849F",
  mysterious: "#6B5A78",
  tender: "#E3E6EA",
};

function MoodPill({ mood, size = "md" }) {
  const c = MOOD_COLORS[mood] || "var(--ink-3)";
  const sm = size === "sm";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontFamily: "var(--font-body)", fontSize: sm ? 12 : 13,
      color: "var(--ink-2)",
    }}>
      <span style={{
        width: sm ? 6 : 7, height: sm ? 6 : 7, borderRadius: 999, background: c,
        boxShadow: "0 0 0 2px color-mix(in oklab, " + c + " 25%, transparent)",
      }}/>
      {mood}
    </span>
  );
}

// Card — shadcn-style with theme-aware ornamentation
function Card({ children, onClick, style = {}, hoverable = false, className = "", ...rest }) {
  return (
    <div
      onClick={onClick}
      className={"oc-card " + className}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        transition: "all 200ms cubic-bezier(.2,.7,.3,1)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onMouseOver={hoverable ? e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      } : undefined}
      onMouseOut={hoverable ? e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

// Section heading with display serif + small mono kicker
function SectionHeading({ kicker, title, action, italic = false }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
      <div>
        {kicker && <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 4 }}>{kicker}</div>}
        <h2 style={{ fontStyle: italic ? "italic" : "normal", color: "var(--ink)" }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

// Search input
function SearchInput({ value, onChange, placeholder = "Search the archive…", autoFocus }) {
  return (
    <div className="oc-search" style={{
      position: "relative",
      display: "flex", alignItems: "center",
      background: "transparent",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "0 16px",
      transition: "border-color 120ms ease",
    }}>
      <I name="Search" size={15} style={{ color: "var(--ink-3)", marginRight: 8 }} />
      <input
        type="text" value={value} placeholder={placeholder} autoFocus={autoFocus}
        onChange={e => onChange(e.target.value)}
        style={{
          background: "transparent", border: 0, outline: 0,
          padding: "9px 6px", fontSize: 15, color: "var(--ink)",
          width: "100%", fontFamily: "var(--font-body)",
        }}
      />
      {value && (
        <button onClick={() => onChange("")} style={{ background: "transparent", border: 0, color: "var(--ink-3)", cursor: "pointer", padding: 4 }}>
          <I name="X" size={13} />
        </button>
      )}
    </div>
  );
}

// Modal shell
function Modal({ open, onClose, children, width = 640, title, subtitle }) {
  if (!open) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="oc-modal"
        style={{
          width, maxWidth: "100%", maxHeight: "calc(100vh - 48px)",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          display: "flex", flexDirection: "column",
          animation: "slideUp 220ms cubic-bezier(.2,.7,.3,1)",
          overflow: "hidden",
        }}
      >
        {(title || subtitle) && (
          <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid var(--border)" }}>
            {subtitle && <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 4 }}>{subtitle}</div>}
            {title && <h3 style={{ color: "var(--ink)" }}>{title}</h3>}
          </div>
        )}
        <div style={{ padding: 28, overflow: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Form Field
function Field({ label, hint, children }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <div className="mono" style={{ color: "var(--ink-2)", marginBottom: 6 }}>{label}</div>
      {children}
      {hint && <div className="small" style={{ color: "var(--ink-3)", marginTop: 4 }}>{hint}</div>}
    </label>
  );
}

const inputStyle = {
  width: "100%", padding: "9px 12px",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  fontSize: 15, fontFamily: "var(--font-body)", color: "var(--ink)",
  outline: 0,
};

function Input(props) { return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />; }
function Textarea(props) { return <textarea {...props} style={{ ...inputStyle, minHeight: 84, resize: "vertical", lineHeight: 1.5, ...(props.style || {}) }} />; }
function Select({ children, ...rest }) {
  return <select {...rest} style={{ ...inputStyle, ...(rest.style || {}), appearance: "none", paddingRight: 32, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='currentColor' d='M0 0h10L5 6z'/></svg>\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}>{children}</select>;
}

// Curiosity card — three card styles based on theme: museum label / polaroid / archive list
function CuriosityCard({ item, onClick, onFav, theme = "velvet" }) {
  const isPoloroid = theme === "soft";
  return (
    <div
      onClick={onClick}
      className="oc-curio"
      style={{
        position: "relative",
        background: "var(--card)",
        border: isPoloroid ? "0" : "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: isPoloroid ? "0 2px 4px rgba(0,0,0,.06), 0 12px 24px -8px rgba(140,100,110,.18)" : "var(--shadow-sm)",
        padding: isPoloroid ? "12px 12px 16px" : 0,
        cursor: "pointer", transition: "all 220ms cubic-bezier(.2,.7,.3,1)",
        transform: "rotate(0deg)",
        overflow: "hidden",
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = isPoloroid ? "translateY(-4px) rotate(-0.6deg)" : "translateY(-3px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = isPoloroid ? "0 2px 4px rgba(0,0,0,.06), 0 12px 24px -8px rgba(140,100,110,.18)" : "var(--shadow-sm)";
      }}
    >
      {/* Tape / wax accent for velvet */}
      {!isPoloroid && (
        <div style={{
          position: "absolute", top: -6, left: "50%", transform: "translateX(-50%) rotate(-2deg)",
          width: 64, height: 16, background: "var(--tape)",
          borderRadius: 1, zIndex: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,.1)",
        }} />
      )}
      {/* Image */}
      <div className="img-stripes" style={{
        aspectRatio: isPoloroid ? "1" : "5/4",
        background: "var(--bg-2)",
        position: "relative",
        borderRadius: isPoloroid ? "var(--radius-sm)" : "var(--radius-lg) var(--radius-lg) 0 0",
        overflow: "hidden",
      }}>
        {item.image && (
          <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        )}
        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); onFav(); }}
          style={{
            position: "absolute", top: 10, right: 10, zIndex: 3,
            background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)",
            border: "0", borderRadius: 999, width: 28, height: 28,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: item.favorite ? "var(--accent-2)" : "var(--ink-3)",
            boxShadow: "0 2px 6px rgba(0,0,0,.15)",
          }}
        >
          <I name="Star" size={14} style={{ fill: item.favorite ? "var(--accent-2)" : "transparent" }} />
        </button>
      </div>
      {/* Body */}
      <div style={{ padding: isPoloroid ? "12px 4px 4px" : "14px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
          <h4 style={{
            fontSize: isPoloroid ? 18 : 18,
            fontFamily: isPoloroid ? "var(--font-hand)" : "var(--font-display)",
            fontWeight: isPoloroid ? 600 : 400,
            color: "var(--ink)", lineHeight: 1.15, fontStyle: isPoloroid ? "normal" : "italic",
          }}>{item.title}</h4>
        </div>
        <p style={{
          margin: "4px 0 10px", fontSize: 13.5, color: "var(--ink-2)",
          lineHeight: 1.45,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{item.description}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <MoodPill mood={item.mood} size="sm" />
          <span className="mono" style={{ color: "var(--ink-3)", fontSize: 9.5 }}>
            {new Date(item.added).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  );
}

// Collection card — drawer/box vibe
function CollectionCard({ collection, onClick, onPin, theme = "velvet" }) {
  return (
    <div
      onClick={onClick}
      className="oc-coll"
      style={{
        position: "relative",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: 22,
        cursor: "pointer", transition: "all 220ms cubic-bezier(.2,.7,.3,1)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        const handle = e.currentTarget.querySelector('[data-handle]');
        if (handle) handle.style.transform = "translateY(-2px)";
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        const handle = e.currentTarget.querySelector('[data-handle]');
        if (handle) handle.style.transform = "";
      }}
    >
      {/* Drawer handle (decorative) */}
      <div data-handle style={{
        position: "absolute", top: 14, right: 22, width: 36, height: 6,
        background: "color-mix(in oklab, " + collection.color + " 60%, transparent)",
        borderRadius: 999, transition: "transform 220ms ease",
      }}/>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "color-mix(in oklab, " + collection.color + " 18%, var(--card))",
          color: collection.color,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontFamily: "var(--font-display)",
          border: "1px solid color-mix(in oklab, " + collection.color + " 35%, transparent)",
        }}>{collection.emoji}</div>
        {collection.pinned && <I name="Pin" size={13} style={{ color: "var(--accent)" }} />}
      </div>
      <h3 style={{ fontSize: 26, color: "var(--ink)", lineHeight: 1.1, fontStyle: "italic", marginBottom: 8 }}>{collection.name}</h3>
      <p className="small" style={{ color: "var(--ink-2)", marginBottom: 16, fontSize: 13, fontStyle: "italic" }}>{collection.note}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px dashed var(--border)" }}>
        <span className="mono" style={{ color: "var(--ink-3)" }}>
          {collection.count} {collection.count === 1 ? "curiosity" : "curiosities"}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onPin && onPin(); }}
          style={{ background: "transparent", border: 0, cursor: "pointer", color: collection.pinned ? "var(--accent)" : "var(--ink-3)", padding: 4 }}
        >
          <I name="Pin" size={14} style={{ fill: collection.pinned ? "var(--accent)" : "transparent" }} />
        </button>
      </div>
    </div>
  );
}

// Top nav bar
function NavBar({ page, onNavigate, onAdd, onRandom, search, onSearch }) {
  const items = [
    { id: "dashboard", label: "Hall", icon: "Home" },
    { id: "collections", label: "Cabinets", icon: "Library" },
    { id: "explore", label: "Explore", icon: "Compass" },
    { id: "stats", label: "Ledger", icon: "BarChart3" },
  ];
  return (
    <div className="oc-nav" style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "color-mix(in oklab, var(--bg) 88%, transparent)",
      backdropFilter: "blur(14px) saturate(140%)",
      WebkitBackdropFilter: "blur(14px) saturate(140%)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", gap: 24 }}>
        {/* Logo */}
        <div onClick={() => onNavigate("dashboard")} style={{ display: "flex", alignItems: "center", cursor: "pointer", marginLeft: 10 }}>
          <div className="oc-nav-logo" style={{ height: 24, width: 130, overflow: "hidden", flexShrink: 0 }}>
            <img src="assets/oddments.svg" alt="Oddments" style={{ height: 145, marginTop: -53, marginLeft: -8, display: "block", width: "auto" }} />
          </div>
        </div>
        {/* Nav */}
        <nav style={{ display: "flex", gap: 4, marginLeft: 12 }}>
          {items.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              style={{
                background: page === item.id ? "var(--surface)" : "transparent",
                border: "1px solid " + (page === item.id ? "var(--border)" : "transparent"),
                color: page === item.id ? "var(--ink)" : "var(--ink-2)",
                padding: "6px 12px", borderRadius: "var(--radius)",
                fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                fontFamily: "var(--font-body)", transition: "all 120ms ease",
              }}
            >
              <I name={item.icon} size={14} />
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ flex: 1, maxWidth: 400, marginLeft: "auto" }}>
          <SearchInput value={search} onChange={onSearch} />
        </div>
        <IconButton icon="Shuffle" title="Random curiosity" size={36} onClick={onRandom} />
        <Button variant="primary" icon="Plus" onClick={onAdd}>New</Button>
      </div>
    </div>
  );
}

Object.assign(window, { Button, IconButton, Tag, MoodPill, Card, SectionHeading, SearchInput, Modal, Field, Input, Textarea, Select, CuriosityCard, CollectionCard, NavBar, MOOD_COLORS, inputStyle });
