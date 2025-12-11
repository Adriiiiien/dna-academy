// routes liées aux personnages : liste, détail, CRUD admin + armes associées
const express = require('express');
const { verifyToken, requireAdmin } = require('../middlewares/auth');
const {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  getCharacterWeapons,
} = require('../controllers/charactersController');

const router = express.Router();

// récupère tous les personnages (liste publique)
router.get('/', getAllCharacters);

// récupère un personnage par id
router.get('/:id', getCharacterById);

// crée un personnage (réservé aux admins)
router.post('/', verifyToken, requireAdmin, createCharacter);

// met à jour un personnage (réservé aux admins)
router.put('/:id', verifyToken, requireAdmin, updateCharacter);

// supprime un personnage (réservé aux admins)
router.delete('/:id', verifyToken, requireAdmin, deleteCharacter);

// récupère les armes recommandées pour un personnage
router.get('/:id/weapons', getCharacterWeapons);

module.exports = router;