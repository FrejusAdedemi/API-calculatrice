const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { add, sub, mul, div } = require('./calculator');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

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

const ops = { add, sub, mul, div };  // ← utilise les fonctions de calculator.js

['add', 'sub', 'mul', 'div'].forEach(op => {
  app.get(`/${op}`, async (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    if (isNaN(a) || isNaN(b)) return res.status(400).json({ error: 'Paramètres invalides' });
    try {
      const result = ops[op](a, b);  // ← appelle la fonction pure
      await db.query(
        'INSERT INTO historique (operation, a, b, resultat) VALUES ($1, $2, $3, $4)',
        [op, a, b, result]
      );
      res.json({ result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
});

app.get('/historique', async (req, res) => {
  const { rows } = await db.query(
    'SELECT * FROM historique ORDER BY created_at DESC LIMIT 20'
  );
  res.json(rows);
});

app.delete('/historique/:id', async (req, res) => {
  await db.query('DELETE FROM historique WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

app.delete('/historique', async (req, res) => {
  await db.query('DELETE FROM historique');
  res.json({ success: true });
});

app.listen(3000, () => console.log('Backend sur port 3000'));
module.exports = app;