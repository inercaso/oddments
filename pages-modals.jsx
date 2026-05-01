// ── Add/Edit modal ──────────────────────────────────────────────────────────
function AddCuriosityModal({ open, onClose, onSubmit, initial, store }) {
  const [form, setForm] = React.useState(() => initial || {
    title: "", description: "", image: "", tags: [], mood: "cozy", category: "objects", collection: store.collections[0]?.id, favorite: false,
  });
  React.useEffect(() => { if (open) setForm(initial || { title: "", description: "", image: "", tags: [], mood: "cozy", category: "objects", collection: store.collections[0]?.id, favorite: false }); }, [open, initial]);
  const [tagInput, setTagInput] = React.useState("");

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t || (form.tags || []).includes(t)) return;
    setForm({ ...form, tags: [...(form.tags || []), t] });
    setTagInput("");
  };

  const removeTag = (t) => setForm({ ...form, tags: (form.tags || []).filter(x => x !== t) });

  const previewImg = form.image || "data:image/svg+xml;utf8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='#e9dfc8'/><text x='100' y='105' text-anchor='middle' font-family='monospace' font-size='10' fill='#8a755a'>image preview</text></svg>");

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit curiosity" : "Catalogue a new curiosity"} subtitle={initial ? "Editing · " + initial.title : "Add to the cabinet"} width={680}>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24 }}>
        <div>
          <div className="img-stripes" style={{ aspectRatio: "1", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--bg-2)", border: "1px solid var(--border)" }}>
            <img src={previewImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div className="small dim" style={{ marginTop: 8, textAlign: "center", fontStyle: "italic" }}>preview</div>
        </div>
        <div>
          <Field label="Title">
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="A small thing, named" autoFocus />
          </Field>
          <Field label="Description">
            <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is it? Where did it come from? Why does it stay?" />
          </Field>
          <Field label="Image URL" hint="Paste a URL — leave blank for a placeholder.">
            <Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://…" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Mood">
              <Select value={form.mood} onChange={e => setForm({ ...form, mood: e.target.value })}>
                {window.SEED.moods.map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
            </Field>
            <Field label="Category">
              <Select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {window.SEED.categories.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Cabinet">
            <Select value={form.collection || ""} onChange={e => setForm({ ...form, collection: e.target.value })}>
              {store.collections.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </Select>
          </Field>
          <Field label="Tags">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {(form.tags || []).map(t => <Tag key={t} removable onRemove={() => removeTag(t)}>{t}</Tag>)}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder="Add a tag…" />
              <Button variant="secondary" onClick={addTag}>Add</Button>
            </div>
          </Field>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, cursor: "pointer" }}>
            <input type="checkbox" checked={!!form.favorite} onChange={e => setForm({ ...form, favorite: e.target.checked })} />
            <span style={{ fontSize: 14, color: "var(--ink-2)" }}>Mark as favorite</span>
          </label>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={() => { if (!form.title.trim()) return; onSubmit(form); }} icon="Check">Save curiosity</Button>
      </div>
    </Modal>
  );
}

// ── New collection modal ────────────────────────────────────────────────────
function CollectionModal({ open, onClose, onSubmit, initial }) {
  const swatches = ["#a8842c", "#6b2229", "#5e8a3a", "#8b97a8", "#e8408a", "#8868b8", "#c87a4a"];
  const emojis = ["✦", "❀", "❅", "❝", "◌", "✿", "✧", "❖", "✺"];
  const [form, setForm] = React.useState(() => initial || { name: "", note: "", color: swatches[0], emoji: emojis[0] });
  React.useEffect(() => { if (open) setForm(initial || { name: "", note: "", color: swatches[0], emoji: emojis[0] }); }, [open, initial]);
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit cabinet" : "A new cabinet"} subtitle={initial ? "Editing collection" : "Group your curiosities"} width={520}>
      <Field label="Name"><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="A poetic name…" autoFocus /></Field>
      <Field label="Note"><Textarea value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="What does this cabinet hold?" /></Field>
      <Field label="Glyph">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {emojis.map(e => (
            <button key={e} onClick={() => setForm({ ...form, emoji: e })}
              style={{
                width: 36, height: 36, borderRadius: 8, fontSize: 18, fontFamily: "var(--font-display)",
                background: form.emoji === e ? "var(--ink)" : "var(--surface)",
                color: form.emoji === e ? "var(--card)" : "var(--ink)",
                border: "1px solid var(--border)", cursor: "pointer",
              }}>{e}</button>
          ))}
        </div>
      </Field>
      <Field label="Accent">
        <div style={{ display: "flex", gap: 6 }}>
          {swatches.map(s => (
            <button key={s} onClick={() => setForm({ ...form, color: s })}
              style={{
                width: 32, height: 32, borderRadius: 999, background: s,
                border: "2px solid " + (form.color === s ? "var(--ink)" : "transparent"),
                cursor: "pointer", boxShadow: "0 0 0 1px var(--border)",
              }}/>
          ))}
        </div>
      </Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={() => { if (!form.name.trim()) return; onSubmit(form); }} icon="Check">{initial ? "Save changes" : "Create cabinet"}</Button>
      </div>
    </Modal>
  );
}

Object.assign(window, {
  Dashboard, CollectionsPage, CollectionDetail, CuriosityDetail, ExplorePage, StatsPage,
  AddCuriosityModal, CollectionModal,
});
