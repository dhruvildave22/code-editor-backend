const jwt = require('jsonwebtoken');
const { ROLES } = require('../constants/roles');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Missing or invalid authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}

const adminAuth = authorize(ROLES.ADMIN);
const moderatorAuth = authorize(ROLES.MODERATOR);
const candidateAuth = authorize(ROLES.CANDIDATE);
const adminOrModeratorAuth = authorize(ROLES.ADMIN, ROLES.MODERATOR);
const allRolesAuth = authorize(ROLES.ADMIN, ROLES.MODERATOR, ROLES.CANDIDATE);

module.exports = {
  authenticate,
  authorize,
  adminAuth,
  moderatorAuth,
  candidateAuth,
  adminOrModeratorAuth,
  allRolesAuth,
};
