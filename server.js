// point d'entrée du serveur express
// charge les variables d'environnement
// configure les middlewares globaux (cors, json, fichiers statiques)
// branche les différentes routes de l'api
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// middlewares globaux
app.use(cors()); // autorise les requêtes depuis le front
app.use(express.json()); // parse le json dans req.body

// fichiers statiques (html / css / js / images) servis depuis /public
app.use(express.static(path.join(__dirname, 'public')));

// routes api (auth, personnages, armes, éléments)
const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/characters');
const weaponRoutes = require('./routes/weapons');
const elementRoutes = require('./routes/elements');

app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/weapons', weaponRoutes);
app.use('/api/elements', elementRoutes);

// démarrage du serveur http
app.listen(port, () => {
  console.log(`Serveur Back-end démarré sur http://localhost:${port}`);
});