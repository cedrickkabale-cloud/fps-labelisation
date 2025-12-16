const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public', {
  maxAge: '1d',
  etag: false
}));
app.use('/assets', express.static('assets', {
  maxAge: '1d',
  etag: false
}));

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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  database.equipment.push(newItem);
  res.status(201).json({ success: true, item: newItem });
});

app.put('/api/equipment/:id', (req, res) => {
  const index = database.equipment.findIndex(item => item._id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Not found' });
  
  database.equipment[index] = {
    ...database.equipment[index],
    ...req.body,
    _id: req.params.id,
    updated_at: new Date().toISOString()
  };
  res.json({ success: true, item: database.equipment[index] });
});

app.delete('/api/equipment/:id', (req, res) => {
  const index = database.equipment.findIndex(item => item._id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Not found' });
  
  database.equipment.splice(index, 1);
  res.json({ success: true, message: 'Deleted successfully' });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FPS Labelisation API working!',
    timestamp: new Date().toISOString(),
    equipmentCount: database.equipment.length
  });
});

// Routes pour assets
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

app.get('/fps-logo.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'fps-logo.png'));
});

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

// Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur en local
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
  });
}

// Export pour Vercel
module.exports = app;