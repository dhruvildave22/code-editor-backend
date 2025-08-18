const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function authorize(allowedTypes = []) {
  return (req, res, next) => {
    if (!req.user || (allowedTypes.length && !allowedTypes.includes(req.user.role))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
