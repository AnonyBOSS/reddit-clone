const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    req.user = null; // No token, so no user
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = decoded;
    next();
  } catch (err) {
    req.user = null; // Invalid token, so no user
    next();
  }
};

module.exports = optionalAuth;