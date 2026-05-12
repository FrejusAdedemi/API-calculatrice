const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');                    // ← mysql2 → pg

const app = express();
app.use(cors());                                   // ← on enlève la restriction origin
app.use(express.json());

const db = new Pool({                              // ← createPool → new Pool
  connectionString: process.env.DATABASE_URL,      // ← une seule variable au lieu de 5
  ssl: { rejectUnauthorized: false }
});

// Créer la table au démarrage
db.query(`
  CREATE TABLE IF NOT EXISTS historique (
    id SERIAL PRIMARY KEY,
    operation VARCHAR(10),
    a NUMERIC,
    b NUMERIC,
    resultat NUMERIC,
    created_at TIMESTAMP DEFAULT NOW()
  )
`);

const ops = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => a / b,
};

['add', 'sub', 'mul', 'div'].forEach(op => {
  app.get(`/${op}`, async (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    if (isNaN(a) || isNaN(b)) return res.status(400).json({ error: 'Paramètres invalides' });
    if (op === 'div' && b === 0) return res.status(400).json({ error: 'Division par zéro' });
    const result = ops[op](a, b);
    await db.query(                                // ← execute → query
      'INSERT INTO historique (operation, a, b, resultat) VALUES ($1, $2, $3, $4)',  // ← ? → $1,$2...
      [op, a, b, result]
    );
    res.json({ result });
  });
});

app.get('/historique', async (req, res) => {
  const { rows } = await db.query(               // ← [rows] → { rows }
    'SELECT * FROM historique ORDER BY created_at DESC LIMIT 20'
  );
  res.json(rows);
});

app.delete('/historique/:id', async (req, res) => {
  await db.query('DELETE FROM historique WHERE id = $1', [req.params.id]);  // ← ? → $1
  res.json({ success: true });
});

app.delete('/historique', async (req, res) => {
  await db.query('DELETE FROM historique');
  res.json({ success: true });
});

app.listen(3000, () => console.log('Backend sur port 3000'));  // ← plus de serverless
module.exports = app;