// contient la logique des routes d'authentification (inscription / connexion / profil)
const pool   = require('../config/db');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is missing. You need to add .env.');
  process.exit(1);
}

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

// POST /api/auth/register
// inscription d'un nouvel utilisateur
async function register(req, res) {
  const { username, password } = req.body;

  // vérifie que les champs requis sont bien présents
  if (!username || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // vérifie si le pseudo existe déjà
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Existing user' });
    }

    // hash du mot de passe avant enregistrement
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    // rôle par défaut = 'user'
    await pool.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashed]
    );

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Error REGISTER :', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/auth/login
// connexion d'un utilisateur existant et génération d'un token
async function login(req, res) {
  const { username, password } = req.body;

  // vérifie que les champs requis sont bien présents
  if (!username || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // récupère l'utilisateur par son pseudo
    const [rows] = await pool.execute(
      'SELECT id, username, password, role FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    // compare le mot de passe fourni avec le hash en base
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // génère un JWT avec les infos essentielles de l'utilisateur
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connected',
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error('Error LOGIN :', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/auth/me
// retourne les infos de l'utilisateur courant à partir du token
async function getMe(req, res) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error('Error ME :', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  register,
  login,
  getMe,
};