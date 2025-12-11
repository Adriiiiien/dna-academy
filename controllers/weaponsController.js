// logique pour les routes d'armes
const pool = require('../config/db');

// GET /api/weapons
// récupère la liste de toutes les armes triées par nom
async function getAllWeapons(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM weapons ORDER BY name ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error GET /weapons :', err);
    res.status(500).json({ message: 'Server error.', error: err });
  }
}

// GET /api/weapons/:id
// récupère une arme spécifique par son id
async function getWeaponById(req, res) {
  const weaponId = req.params.id;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM weapons WHERE id = ?',
      [weaponId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Weapon not found.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error GET /weapons/:id :', err);
    res.status(500).json({ message: 'Server error.', error: err });
  }
}

module.exports = {
  getAllWeapons,
  getWeaponById,
};