const express = require('express');
const { signToken, ROLE_PERMISSIONS, EXPIRY } = require('../auth');

const router = express.Router();

/**
 * @swagger
 * /token:
 *   get:
 *     summary: Get a JWT token
 *     description: Returns a signed JWT. No authentication required. For demos — token expires in 60 seconds.
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, WRITER, VISITOR]
 *           default: VISITOR
 *         description: Role to embed in the token
 *     responses:
 *       200:
 *         description: Token issued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 */
router.get('/', (req, res) => {
  const role = (req.query.role || 'VISITOR').toUpperCase();
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.VISITOR;
  const token = signToken({ role, permissions });
  res.json({ token, role, permissions, expiresIn: EXPIRY });
});

/**
 * @swagger
 * /token:
 *   post:
 *     summary: Get a JWT token (POST)
 *     description: Returns a signed JWT. Pass role or permissions in the request body.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, WRITER, VISITOR]
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [READ, WRITE]
 *     responses:
 *       200:
 *         description: Token issued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 */
router.post('/', (req, res) => {
  let role = 'VISITOR';
  let permissions;

  if (req.body.role) {
    role = req.body.role.toUpperCase();
    permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.VISITOR;
  } else if (Array.isArray(req.body.permissions) && req.body.permissions.length > 0) {
    permissions = req.body.permissions.map(p => p.toUpperCase());
    role = 'CUSTOM';
  } else {
    permissions = ROLE_PERMISSIONS.VISITOR;
  }

  const token = signToken({ role, permissions });
  res.json({ token, role, permissions, expiresIn: EXPIRY });
});

module.exports = router;
