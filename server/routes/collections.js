const express = require('express');
const { db, parseCollection, getCollectionCount } = require('../db');
const { requireAuth, requirePermission } = require('../auth');

const router = express.Router();

/**
 * @swagger
 * /api/collections:
 *   get:
 *     summary: List collections (paginated)
 *     tags: [Collections]
 *     parameters:
 *       - { in: query, name: skip,   schema: { type: integer, default: 0 } }
 *       - { in: query, name: limit,  schema: { type: integer, default: 20 } }
 *       - { in: query, name: pinned, schema: { type: string, enum: [true, false] }, description: Filter pinned collections }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedCollections'
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', requireAuth, (req, res) => {
  const skip  = Math.max(0, parseInt(req.query.skip)  || 0);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));

  let where = '1=1';
  const params = [];
  if (req.query.pinned === 'true')  { where += ' AND pinned = 1'; }
  if (req.query.pinned === 'false') { where += ' AND pinned = 0'; }

  const total = db.prepare(`SELECT COUNT(*) as n FROM collections WHERE ${where}`).get(...params).n;
  const rows  = db.prepare(`SELECT * FROM collections WHERE ${where} ORDER BY name ASC LIMIT ? OFFSET ?`)
                  .all(...params, limit, skip);

  const data = rows.map(row => parseCollection(row, getCollectionCount(row.id)));
  res.json({ data, total, skip, limit });
});

/**
 * @swagger
 * /api/collections/{id}:
 *   get:
 *     summary: Get a single collection
 *     tags: [Collections]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM collections WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Collection not found' });
  res.json(parseCollection(row, getCollectionCount(row.id)));
});

/**
 * @swagger
 * /api/collections:
 *   post:
 *     summary: Create a collection
 *     tags: [Collections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CollectionInput'
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', requireAuth, requirePermission('WRITE'), (req, res) => {
  const { name, color = '#a8842c', emoji = '✦', note = '', pinned = false } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'name is required' });

  const id = 'col' + Date.now();
  db.prepare('INSERT INTO collections (id, name, color, emoji, note, pinned) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, name.trim(), color, emoji, note, pinned ? 1 : 0);

  const row = db.prepare('SELECT * FROM collections WHERE id = ?').get(id);
  res.status(201).json(parseCollection(row, 0));
});

/**
 * @swagger
 * /api/collections/{id}:
 *   put:
 *     summary: Replace a collection (full update)
 *     tags: [Collections]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CollectionInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', requireAuth, requirePermission('WRITE'), (req, res) => {
  const existing = db.prepare('SELECT id FROM collections WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Collection not found' });

  const { name, color = '#a8842c', emoji = '✦', note = '', pinned = false } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'name is required' });

  db.prepare('UPDATE collections SET name=?, color=?, emoji=?, note=?, pinned=? WHERE id=?')
    .run(name.trim(), color, emoji, note, pinned ? 1 : 0, req.params.id);

  const row = db.prepare('SELECT * FROM collections WHERE id = ?').get(req.params.id);
  res.json(parseCollection(row, getCollectionCount(req.params.id)));
});

/**
 * @swagger
 * /api/collections/{id}:
 *   patch:
 *     summary: Partially update a collection
 *     tags: [Collections]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CollectionInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id', requireAuth, requirePermission('WRITE'), (req, res) => {
  const existing = db.prepare('SELECT id FROM collections WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Collection not found' });

  const allowed = ['name', 'color', 'emoji', 'note', 'pinned'];
  const sets = [];
  const vals = [];

  for (const [key, val] of Object.entries(req.body)) {
    if (!allowed.includes(key)) continue;
    sets.push(`${key} = ?`);
    vals.push(key === 'pinned' ? (val ? 1 : 0) : (val ?? null));
  }

  if (sets.length === 0) return res.status(400).json({ error: 'No valid fields to update' });

  vals.push(req.params.id);
  db.prepare(`UPDATE collections SET ${sets.join(', ')} WHERE id = ?`).run(...vals);

  const row = db.prepare('SELECT * FROM collections WHERE id = ?').get(req.params.id);
  res.json(parseCollection(row, getCollectionCount(req.params.id)));
});

/**
 * @swagger
 * /api/collections/{id}:
 *   delete:
 *     summary: Delete a collection (unlinks its curiosities)
 *     tags: [Collections]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', requireAuth, requirePermission('WRITE'), (req, res) => {
  const existing = db.prepare('SELECT id FROM collections WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Collection not found' });

  const deleteCollection = db.transaction((id) => {
    db.prepare('UPDATE curiosities SET collection = NULL WHERE collection = ?').run(id);
    db.prepare('DELETE FROM collections WHERE id = ?').run(id);
  });
  deleteCollection(req.params.id);

  res.status(204).send();
});

module.exports = router;
