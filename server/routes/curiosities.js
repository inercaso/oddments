const express = require('express');
const { db, parseCuriosity } = require('../db');
const { requireAuth, requirePermission } = require('../auth');

const router = express.Router();

/**
 * @swagger
 * /api/curiosities:
 *   get:
 *     summary: List curiosities (paginated)
 *     tags: [Curiosities]
 *     parameters:
 *       - { in: query, name: skip,       schema: { type: integer, default: 0 } }
 *       - { in: query, name: limit,      schema: { type: integer, default: 20 } }
 *       - { in: query, name: mood,       schema: { type: string } }
 *       - { in: query, name: category,   schema: { type: string } }
 *       - { in: query, name: collection, schema: { type: string } }
 *       - { in: query, name: favorite,   schema: { type: string, enum: [true, false] } }
 *       - { in: query, name: search,     schema: { type: string } }
 *     responses:
 *       200:
 *         description: Paginated curiosity list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedCuriosities'
 *       401:
 *         description: Missing or invalid token
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

  if (req.query.mood)       { where += ' AND mood = ?';       params.push(req.query.mood); }
  if (req.query.category)   { where += ' AND category = ?';   params.push(req.query.category); }
  if (req.query.collection) { where += ' AND collection = ?'; params.push(req.query.collection); }
  if (req.query.favorite === 'true')  where += ' AND favorite = 1';
  if (req.query.favorite === 'false') where += ' AND favorite = 0';
  if (req.query.search) {
    const q = '%' + req.query.search + '%';
    where += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)';
    params.push(q, q, q);
  }

  const total = db.prepare(`SELECT COUNT(*) as n FROM curiosities WHERE ${where}`).get(...params).n;
  const rows  = db.prepare(`SELECT * FROM curiosities WHERE ${where} ORDER BY added DESC LIMIT ? OFFSET ?`)
                  .all(...params, limit, skip);

  res.json({ data: rows.map(parseCuriosity), total, skip, limit });
});

/**
 * @swagger
 * /api/curiosities/{id}:
 *   get:
 *     summary: Get a single curiosity
 *     tags: [Curiosities]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curiosity'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM curiosities WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Curiosity not found' });
  res.json(parseCuriosity(row));
});

/**
 * @swagger
 * /api/curiosities:
 *   post:
 *     summary: Create a curiosity
 *     tags: [Curiosities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CuriosityInput'
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curiosity'
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Insufficient permissions
 */
router.post('/', requireAuth, requirePermission('WRITE'), (req, res) => {
  const { title, description = '', image = '', mood = 'cozy', category = 'objects',
          tags = [], collection = null, favorite = false } = req.body;

  if (!title?.trim()) return res.status(400).json({ error: 'title is required' });

  const id    = 'c' + Date.now();
  const added = new Date().toISOString().slice(0, 10);

  db.prepare(`
    INSERT INTO curiosities (id, title, description, image, mood, category, tags, collection, favorite, added)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, title.trim(), description, image, mood, category, JSON.stringify(tags), collection || null, favorite ? 1 : 0, added);

  const row = db.prepare('SELECT * FROM curiosities WHERE id = ?').get(id);
  res.status(201).json(parseCuriosity(row));
});

/**
 * @swagger
 * /api/curiosities/{id}:
 *   put:
 *     summary: Replace a curiosity (full update)
 *     tags: [Curiosities]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CuriosityInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curiosity'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', requireAuth, requirePermission('WRITE'), (req, res) => {
  const existing = db.prepare('SELECT * FROM curiosities WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Curiosity not found' });

  const { title, description = '', image = '', mood = 'cozy', category = 'objects',
          tags = [], collection = null, favorite = false } = req.body;

  if (!title?.trim()) return res.status(400).json({ error: 'title is required' });

  db.prepare(`
    UPDATE curiosities
    SET title=?, description=?, image=?, mood=?, category=?, tags=?, collection=?, favorite=?
    WHERE id=?
  `).run(title.trim(), description, image, mood, category, JSON.stringify(tags), collection || null, favorite ? 1 : 0, req.params.id);

  const row = db.prepare('SELECT * FROM curiosities WHERE id = ?').get(req.params.id);
  res.json(parseCuriosity(row));
});

/**
 * @swagger
 * /api/curiosities/{id}:
 *   patch:
 *     summary: Partially update a curiosity
 *     tags: [Curiosities]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CuriosityInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curiosity'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id', requireAuth, requirePermission('WRITE'), (req, res) => {
  const existing = db.prepare('SELECT * FROM curiosities WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Curiosity not found' });

  const allowed = ['title', 'description', 'image', 'mood', 'category', 'tags', 'collection', 'favorite'];
  const sets = [];
  const vals = [];

  for (const [key, val] of Object.entries(req.body)) {
    if (!allowed.includes(key)) continue;
    sets.push(`${key} = ?`);
    if (key === 'tags')       vals.push(JSON.stringify(val));
    else if (key === 'favorite') vals.push(val ? 1 : 0);
    else vals.push(val ?? null);
  }

  if (sets.length === 0) return res.status(400).json({ error: 'No valid fields to update' });

  vals.push(req.params.id);
  db.prepare(`UPDATE curiosities SET ${sets.join(', ')} WHERE id = ?`).run(...vals);

  const row = db.prepare('SELECT * FROM curiosities WHERE id = ?').get(req.params.id);
  res.json(parseCuriosity(row));
});

/**
 * @swagger
 * /api/curiosities/{id}:
 *   delete:
 *     summary: Delete a curiosity
 *     tags: [Curiosities]
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
  const existing = db.prepare('SELECT id FROM curiosities WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Curiosity not found' });
  db.prepare('DELETE FROM curiosities WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;
