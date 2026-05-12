const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'host.docker.internal',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'calculatrice'
});

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
    await db.execute(
      'INSERT INTO historique (operation, a, b, resultat) VALUES (?, ?, ?, ?)',
      [op, a, b, result]
    );
    res.json({ result });
  });
});

app.get('/historique', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM historique ORDER BY created_at DESC LIMIT 20');
  res.json(rows);
});

// Supprimer une ligne
app.delete('/historique/:id', async (req, res) => {
  await db.execute('DELETE FROM historique WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// Vider tout l'historique
app.delete('/historique', async (req, res) => {
  await db.execute('DELETE FROM historique');
  res.json({ success: true });
});

app.listen(3000, () => console.log('Calculatrice sur port 3000'));