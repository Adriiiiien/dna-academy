// logique pour les routes liées aux éléments
const pool = require('../config/db');

// GET /api/elements
// récupère la liste de tous les éléments triés par nom
async function getAllElements(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM elements ORDER BY name ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error GET /elements :', err);
    res.status(500).json({ message: 'Server error.', error: err });
  }
}

module.exports = {
  getAllElements,
};