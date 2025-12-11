// routes pour les éléments : liste simple (publique)
const express = require('express');
const { getAllElements } = require('../controllers/elementsController');

const router = express.Router();

// retourne tous les éléments triés par nom
router.get('/', getAllElements);

module.exports = router;