// api.js — REST client for the Oddments backend.
// Sets window.API with async methods mirroring store actions.
// Loaded as a plain <script> before store.jsx.
(function () {
  const BASE = 'http://localhost:3001';
  let _token = null;
  let _tokenExpiry = 0;

  async function fetchToken() {
    const res = await fetch(BASE + '/token?role=ADMIN');
    if (!res.ok) throw new Error('Could not fetch token');
    const data = await res.json();
    _token = data.token;
    // Refresh 5s before expiry to avoid edge-case 401s
    _tokenExpiry = Date.now() + (data.expiresIn - 5) * 1000;
    return _token;
  }

  async function getToken() {
    if (!_token || Date.now() >= _tokenExpiry) await fetchToken();
    return _token;
  }

  async function apiFetch(path, options) {
    options = options || {};
    const token = await getToken();
    const res = await fetch(BASE + path, Object.assign({}, options, {
      headers: Object.assign({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, options.headers || {}),
    }));
    // Auto-refresh on 401 and retry once
    if (res.status === 401) {
      await fetchToken();
      return apiFetch(path, options);
    }
    return res;
  }

  async function probe() {
    try { await fetchToken(); return true; } catch (e) { return false; }
  }

  // ── Curiosities ──────────────────────────────────────────────────────────────

  async function getCuriosities(params) {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await apiFetch('/api/curiosities' + q);
    return res.json();
  }

  async function getCuriosity(id) {
    const res = await apiFetch('/api/curiosities/' + id);
    return res.json();
  }

  async function createCuriosity(item) {
    const res = await apiFetch('/api/curiosities', { method: 'POST', body: JSON.stringify(item) });
    return res.json();
  }

  async function updateCuriosity(id, patch) {
    const res = await apiFetch('/api/curiosities/' + id, { method: 'PATCH', body: JSON.stringify(patch) });
    return res.json();
  }

  async function deleteCuriosity(id) {
    await apiFetch('/api/curiosities/' + id, { method: 'DELETE' });
  }

  // ── Collections ──────────────────────────────────────────────────────────────

  async function getCollections(params) {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await apiFetch('/api/collections' + q);
    return res.json();
  }

  async function getCollection(id) {
    const res = await apiFetch('/api/collections/' + id);
    return res.json();
  }

  async function createCollection(col) {
    const res = await apiFetch('/api/collections', { method: 'POST', body: JSON.stringify(col) });
    return res.json();
  }

  async function updateCollection(id, patch) {
    const res = await apiFetch('/api/collections/' + id, { method: 'PATCH', body: JSON.stringify(patch) });
    return res.json();
  }

  async function deleteCollection(id) {
    await apiFetch('/api/collections/' + id, { method: 'DELETE' });
  }

  window.API = {
    probe,
    getCuriosities, getCuriosity, createCuriosity, updateCuriosity, deleteCuriosity,
    getCollections, getCollection, createCollection, updateCollection, deleteCollection,
  };
})();
