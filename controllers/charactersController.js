// contient la logique des routes pour les personnages
const pool = require('../config/db');

// GET /api/characters
// récupère et renvoie la liste de tous les personnages
async function getAllCharacters(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM characters');

    // formate les données brutes de la bdd pour le front
    const formatted = rows.map(char => ({
      id: char.id,
      name: char.name,
      element: char.element,
      images: {
        icon: char.image_icon_url,
        card: char.image_card_url,
      },
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error GET /characters :', err);
    res.status(500).send('Server error.');
  }
}

// GET /api/characters/:id
// récupère un personnage précis par son id
async function getCharacterById(req, res) {
  const charId = req.params.id;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM characters WHERE id = ?',
      [charId]
    );

    if (rows.length === 0) {
      return res.status(404).send('Character not found');
    }

    const char = rows[0];
    res.json({
      id: char.id,
      name: char.name,
      element: char.element,
      images: {
        icon: char.image_icon_url,
        card: char.image_card_url,
      },
    });
  } catch (err) {
    console.error('Erreur GET /characters/:id :', err);
    res.status(500).send('Server error.');
  }
}

// POST /api/characters
// crée un nouveau personnage avec les données fournies dans le body
async function createCharacter(req, res) {
  const { id, name, element, image_icon_url, image_card_url } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO characters 
        (id, name, element, image_icon_url, image_card_url) 
      VALUES 
        (?, ?, ?, ?, ?)
    `,
      [id, name, element, image_icon_url, image_card_url]
    );

    res.status(201).json({ message: 'Character successfully created !', newId: id });
  } catch (err) {
    console.error("Error during insertion :", err);
    res.status(500).json({
      message: 'Error while creating the character.',
      error: err,
    });
  }
}

// PUT /api/characters/:id
// met à jour un personnage existant identifié par son id
async function updateCharacter(req, res) {
  const charId = req.params.id;
  const { name, element, image_icon_url, image_card_url } = req.body;

  try {
    const [result] = await pool.query(
      `
      UPDATE characters SET 
        name = ?, 
        element = ?, 
        image_icon_url = ?, 
        image_card_url = ?
      WHERE 
        id = ?
    `,
      [name, element, image_icon_url, image_card_url, charId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: 'Character not found (incorrect ID).' });
    }

    res.status(200).json({ message: 'Character successfully updated.' });
  } catch (err) {
    console.error("Error during update :", err);
    res.status(500).json({
      message: 'Error during update.',
      error: err,
    });
  }
}

// DELETE /api/characters/:id
// supprime un personnage par son id
async function deleteCharacter(req, res) {
  const charId = req.params.id;

  try {
    const [result] = await pool.query(
      'DELETE FROM characters WHERE id = ?',
      [charId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Character not found.' });
    }

    res.status(200).json({ message: 'Character successfully deleted.' });
  } catch (err) {
    console.error("Error during deletion :", err);
    res.status(500).json({
      message: 'Error during deletion.',
      error: err,
    });
  }
}

// GET /api/characters/:id/weapons
// récupère les armes associées à un personnage donné
async function getCharacterWeapons(req, res) {
  const charId = req.params.id;

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        w.id,
        w.name,
        w.element,
        w.weapon_type,
        w.damage_type,
        w.image_url,
        cw.is_best_in_slot,
        cw.notes
      FROM character_weapons cw
      JOIN weapons w ON cw.weapon_id = w.id
      WHERE cw.character_id = ?
      ORDER BY cw.is_best_in_slot DESC, w.name ASC
    `,
      [charId]
    );

    // formate les données pour inclure les infos d'arme + meta (best in slot, notes)
    const formatted = rows.map(row => ({
      id: row.id,
      name: row.name,
      element: row.element,
      weapon_type: row.weapon_type,
      damage_type: row.damage_type,
      image_url: row.image_url,
      is_best_in_slot: !!row.is_best_in_slot,
      notes: row.notes,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error GET /characters/:id/weapons :', err);
    res.status(500).json({ message: 'Server error.', error: err });
  }
}

module.exports = {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  getCharacterWeapons,
};
