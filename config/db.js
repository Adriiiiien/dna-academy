// connexion à MySQL via un pool, partagé par toutes les routes.
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dna_db',
  waitForConnections: true, // met en attente si toutes les connexions sont utilisées
  connectionLimit: 10, // max 10 connexions simultanées
  queueLimit: 0, // 0 = pas de limite sur la file d’attente
});

// test rapide au démarrage pour vérifier l’accès à la base
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('Connected to the MySQL database', process.env.DB_NAME || 'dna_db');
    conn.release();
  } catch (err) {
    console.error('MySQL connection error:', err.message);
  }
}

testConnection();

module.exports = pool;