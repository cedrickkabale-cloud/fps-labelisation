require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();
const fs = require('fs');
// In-memory fallback store used when the DB is unavailable (development/testing)
let fallbackItems = [];
const fallbackFile = path.join(__dirname, 'fallback_items.json');

function loadFallback() {
  try {
    if (fs.existsSync(fallbackFile)) {
      const raw = fs.readFileSync(fallbackFile, 'utf8');
      fallbackItems = JSON.parse(raw) || [];
    }
  } catch (err) {
    console.warn('Warning: failed to load fallback file:', err.message || err);
    fallbackItems = [];
  }
}

function saveFallback() {
  try {
    fs.writeFileSync(fallbackFile, JSON.stringify(fallbackItems, null, 2), 'utf8');
  } catch (err) {
    console.warn('Warning: failed to save fallback file:', err.message || err);
  }
}

// Load persisted fallback items on startup
loadFallback();

// Middleware - Augmenter la limite pour les données JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
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
    // Merge persistent items with in-memory fallback items for local testing
    const combined = Array.isArray(equipment) ? equipment.concat(fallbackItems) : fallbackItems.slice();
    res.json(combined);
  } catch (error) {
    console.error('Erreur GET /api/equipment (fallback to in-memory):', error.message || error);
    res.json(fallbackItems);
  }
});

app.post('/api/equipment', async (req, res) => {
  try {
    const newItem = await db.createEquipment(req.body);
    res.status(201).json({ success: true, item: newItem });
  } catch (error) {
    console.warn('Erreur POST /api/equipment (DB unavailable) - using in-memory fallback:', error.message || error);
    // Create a fallback item so tests and the UI can continue to work without MongoDB
    const id = `EQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const fallbackItem = {
      id,
      ...req.body,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };
    fallbackItems.unshift(fallbackItem);
    // Limit fallback store size to avoid unbounded memory growth during development
    if (fallbackItems.length > 1000) fallbackItems.length = 1000;
    // Persist to disk
    saveFallback();
    res.status(201).json({ success: true, item: fallbackItem, warning: 'stored-in-memory' });
  }
});

app.put('/api/equipment/:id', async (req, res) => {
  try {
    const updatedItem = await db.updateEquipment(req.params.id, req.body);
    res.json({ success: true, item: updatedItem });
  } catch (error) {
    console.warn('Erreur PUT /api/equipment (DB unavailable or not found) - trying in-memory fallback:', error.message || error);
    // Try to update in-memory fallback store
    const idx = fallbackItems.findIndex(it => it.id === req.params.id);
    if (idx !== -1) {
      fallbackItems[idx] = { ...fallbackItems[idx], ...req.body, updated_at: new Date().toISOString() };
      saveFallback();
      return res.json({ success: true, item: fallbackItems[idx], warning: 'updated-in-memory' });
    }
    const status = error.message === 'Equipment not found' ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
});

app.delete('/api/equipment/:id', async (req, res) => {
  try {
    await db.deleteEquipment(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.warn('Erreur DELETE /api/equipment (DB unavailable or not found) - trying in-memory fallback:', error.message || error);
    const idx = fallbackItems.findIndex(it => it.id === req.params.id);
    if (idx !== -1) {
      fallbackItems.splice(idx, 1);
      saveFallback();
      return res.json({ success: true, message: 'Deleted (in-memory)' });
    }
    const status = error.message === 'Equipment not found' ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
});

app.get('/api/test', async (req, res) => {
  try {
    // Vérifier les variables d'environnement disponibles
    const envVars = {
      hasStockageUrl: !!process.env.STOCKAGE_PRISMA_DATABASE_URL,
      hasPrismaUrl: !!process.env.PRISMA_DATABASE_URL,
      hasStockageDbUrl: !!process.env.STOCKAGE_DATABASE_URL
    };
    
    let count = 0;
    try {
      count = await db.countEquipment();
    } catch (err) {
      console.warn('Warning: countEquipment failed (DB unavailable):', err.message || err);
      count = 0;
    }

    res.json({ 
      status: 'OK', 
      message: 'FPS Labelisation API (test endpoint)',
      timestamp: new Date().toISOString(),
      equipmentCount: count,
      database: process.env.MONGODB_URI ? 'MongoDB' : 'Unavailable',
      envVars
    });
  } catch (error) {
    console.error('Erreur /api/test:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: error.message || 'Unknown error',
      stack: error.stack,
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