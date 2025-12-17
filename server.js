require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db');
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

// Routes API avec Cosmos DB
app.get('/api/equipment', async (req, res) => {
  try {
    const equipment = await db.getAllEquipment();
    res.json(equipment);
  } catch (error) {
    console.error('Erreur GET /api/equipment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/equipment', async (req, res) => {
  try {
    const newItem = await db.createEquipment(req.body);
    res.status(201).json({ success: true, item: newItem });
  } catch (error) {
    console.error('Erreur POST /api/equipment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/equipment/:id', async (req, res) => {
  try {
    const updatedItem = await db.updateEquipment(req.params.id, req.body);
    res.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error('Erreur PUT /api/equipment:', error);
    const status = error.message === 'Equipment not found' ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
});

app.delete('/api/equipment/:id', async (req, res) => {
  try {
    await db.deleteEquipment(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Erreur DELETE /api/equipment:', error);
    const status = error.message === 'Equipment not found' ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
});

app.get('/api/test', async (req, res) => {
  try {
    const count = await db.countEquipment();
    res.json({ 
      status: 'OK', 
      message: 'FPS Labelisation API working with Cosmos DB!',
      timestamp: new Date().toISOString(),
      equipmentCount: count,
      database: 'Azure Cosmos DB'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Routes pour assets
app.get('/favicon.ico', (req, res) => {
  // Serve an SVG favicon to avoid needing a binary .ico file
  res.type('image/svg+xml');
  res.sendFile(path.join(__dirname, 'assets', 'fps-logo.svg'));
});

app.get('/fps-logo.png', (req, res) => {
  // Serve the logo from the assets folder (fallback exists there)
  res.sendFile(path.join(__dirname, 'assets', 'fps-logo.png'));
});

// Also expose an SVG logo for modern browsers and CSS backgrounds
app.get('/fps-logo.svg', (req, res) => {
  res.type('image/svg+xml');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', 'fps-logo.svg'));
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
  const HOST = process.env.HOST || '0.0.0.0';
  app.listen(PORT, HOST, () => {
    console.log(`✅ Serveur lancé sur http://${HOST}:${PORT}`);
  });
}

// Export pour Vercel
module.exports = app;