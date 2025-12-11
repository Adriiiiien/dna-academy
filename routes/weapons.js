// routes pour les armes : liste + détail (accès public)
const express = require('express');
const {
  getAllWeapons,
  getWeaponById,
} = require('../controllers/weaponsController');

const router = express.Router();

// retourne toutes les armes, triées par nom
router.get('/', getAllWeapons);

// retourne une arme via son id
router.get('/:id', getWeaponById);

module.exports = router;