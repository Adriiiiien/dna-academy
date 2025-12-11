// middlewares d'authentification pour express :
// verifyToken : vérifie le jwt envoyé par le front
// requireAdmin : vérifie que l'utilisateur est admin
// utilisés dans les routes protégées

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is missing. You need to add .env.');
  process.exit(1);
}

// vérifie la présence et la validité du token jwt
function verifyToken(req, res, next) {
  const header = req.headers['authorization']; // "Bearer TOKEN"

  if (!header) {
    return res.status(401).json({ message: 'Missing token' });
  }

  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: "Invalid authentication format" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // decoded contient { id, username, role, iat, exp }
    req.user = decoded;
    next();
  });
}

// vérifie que l'utilisateur connecté a le rôle "admin"
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

module.exports = {
  verifyToken,
  requireAdmin,
};