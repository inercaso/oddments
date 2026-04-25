// icons.jsx — Lucide icon wrappers.
// Lucide UMD format: window.lucide.Heart === ["svg", svgAttrs, [["path", {d:"..."}], ...]]
// Children are inner SVG nodes only (paths/circles/lines), not nested svgs.

function Icon({ name, size = 16, stroke = 1.6, className = "", style = {}, ...rest }) {
  const node = (window.lucide && window.lucide[name]) || null;
  // Fallback: simple dot
  if (!node || !Array.isArray(node) || node[0] !== "svg") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </svg>
    );
  }
  const children = node[2] || [];
  const mapAttrs = (attrs) => {
    const out = {};
    for (const k in attrs) {
      if (k === "class") out.className = attrs[k];
      else if (k === "stroke-width") out.strokeWidth = attrs[k];
      else if (k === "stroke-linecap") out.strokeLinecap = attrs[k];
      else if (k === "stroke-linejoin") out.strokeLinejoin = attrs[k];
      else if (k === "stroke-dasharray") out.strokeDasharray = attrs[k];
      else if (k === "stroke-dashoffset") out.strokeDashoffset = attrs[k];
      else if (k === "fill-rule") out.fillRule = attrs[k];
      else if (k === "clip-rule") out.clipRule = attrs[k];
      else out[k] = attrs[k];
    }
    return out;
  };
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      className={"lucide " + className}
      style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle", ...style }}
      {...rest}
    >
      {children.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...mapAttrs(attrs) }))}
    </svg>
  );
}

window.Icon = Icon;
