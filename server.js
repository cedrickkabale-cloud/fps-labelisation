const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use('/assets', express.static('assets'));

// Base de données en mémoire
let database = {
  lastId: 0,
  equipment: []
};

// Routes API
app.get('/api/equipment', (req, res) => {
  res.json(database.equipment || []);
});

app.post('/api/equipment', (req, res) => {
  database.lastId = (database.lastId || 0) + 1;
  const newItem = {
    _id: String(database.lastId),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  database.equipment.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/equipment/:id', (req, res) => {
  const index = database.equipment.findIndex(item => item._id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  database.equipment[index] = {
    ...database.equipment[index],
    ...req.body,
    _id: req.params.id,
    updatedAt: new Date().toISOString()
  };
  res.json(database.equipment[index]);
});

app.delete('/api/equipment/:id', (req, res) => {
  const index = database.equipment.findIndex(item => item._id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  database.equipment.splice(index, 1);
  res.json({ message: 'Deleted successfully' });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FPS Labelisation API working!',
    timestamp: new Date().toISOString(),
    equipmentCount: database.equipment.length
  });
});

// Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export pour Vercel
module.exports = app;