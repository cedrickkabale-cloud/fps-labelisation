const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database en mémoire (pas de fichier)
let database = {
  lastId: 0,
  equipment: []
};

function readDB() {
  return database;
}

function writeDB(db) {
  database = db;
}

// Static files
app.use(express.static('public'));

// API
app.get('/api/equipment', (req, res) => {
  const db = readDB();
  res.json(db.equipment || []);
});

app.post('/api/equipment', (req, res) => {
  const db = readDB();
  db.lastId = (db.lastId || 0) + 1;
  const newItem = {
    _id: String(db.lastId),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.equipment.push(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

app.put('/api/equipment/:id', (req, res) => {
  const db = readDB();
  const index = db.equipment.findIndex(item => item._id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  db.equipment[index] = {
    ...db.equipment[index],
    ...req.body,
    _id: req.params.id,
    updatedAt: new Date().toISOString()
  };
  writeDB(db);
  res.json(db.equipment[index]);
});

app.delete('/api/equipment/:id', (req, res) => {
  const db = readDB();
  const index = db.equipment.findIndex(item => item._id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  db.equipment.splice(index, 1);
  writeDB(db);
  res.json({ message: 'Deleted' });
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});