const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database
const DB_PATH = path.join(__dirname, 'server', 'db.json');
const DEFAULT_DB = { lastId: 0, equipment: [] };

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
    return DEFAULT_DB;
  }
}

async function writeDB(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

// Static files
app.use(express.static('public'));

// API
app.get('/api/equipment', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.equipment || []);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/equipment', async (req, res) => {
  try {
    const db = await readDB();
    db.lastId = (db.lastId || 0) + 1;
    const newItem = {
      _id: String(db.lastId),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.equipment.push(newItem);
    await writeDB(db);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/equipment/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.equipment.findIndex(item => item._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });
    
    db.equipment[index] = {
      ...db.equipment[index],
      ...req.body,
      _id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    await writeDB(db);
    res.json(db.equipment[index]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/equipment/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.equipment.findIndex(item => item._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });
    
    db.equipment.splice(index, 1);
    await writeDB(db);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});