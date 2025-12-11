// POST /api/auth/register : inscription d'un nouvel utilisateur
// POST /api/auth/login : connexion et génération du jwt
// GET /api/auth/me : retourne l'utilisateur courant depuis le token
const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const {
  register,
  login,
  getMe,
} = require('../controllers/authController');

const router = express.Router();

// inscription d'un utilisateur
router.post('/register', register);

// connexion + retour du jwt et des infos user
router.post('/login', login);

// infos du user courant à partir du token
router.get('/me', verifyToken, getMe);

module.exports = router;