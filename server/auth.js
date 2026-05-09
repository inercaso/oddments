const jwt = require('jsonwebtoken');

const ROLE_PERMISSIONS = {
  ADMIN:   ['READ', 'WRITE'],
  WRITER:  ['READ', 'WRITE'],
  VISITOR: ['READ'],
};

const EXPIRY = 60; // seconds

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error('JWT_SECRET is not set. Check server/.env');

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRY });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ error: msg });
  }
}

function requirePermission(perm) {
  return (req, res, next) => {
    const perms = req.user?.permissions || [];
    if (!perms.includes(perm)) {
      return res.status(403).json({ error: `Permission '${perm}' required` });
    }
    next();
  };
}

module.exports = { signToken, requireAuth, requirePermission, ROLE_PERMISSIONS, EXPIRY };
