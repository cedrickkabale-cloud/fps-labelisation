// FPS Labelisation Server - Version autonome pour Render
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;

console.log('🚀 Démarrage de l\'application FPS Labelisation...');
console.log('📁 Répertoire de travail:', process.cwd());
console.log('🔧 Version Node.js:', process.version);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database functionality
const DB_PATH = path.join(__dirname, 'server', 'db.json');
const DEFAULT_DB = { lastId: 0, equipment: [] };

async function readRaw() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }
}

async function writeRaw(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

async function getAll() {
  const db = await readRaw();
  return db.equipment || [];
}

async function getById(id) {
  const db = await readRaw();
  return (db.equipment || []).find(item => String(item._id) === String(id)) || null;
}

async function create(data) {
  const db = await readRaw();
  if (!db.equipment) db.equipment = [];
  db.lastId = (db.lastId || 0) + 1;
  
  const newItem = {
    _id: String(db.lastId),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.equipment.push(newItem);
  await writeRaw(db);
  return newItem;
}

async function update(id, data) {
  const db = await readRaw();
  if (!db.equipment) return null;
  
  const index = db.equipment.findIndex(item => String(item._id) === String(id));
  if (index === -1) return null;
  
  db.equipment[index] = {
    ...db.equipment[index],
    ...data,
    _id: String(id),
    updatedAt: new Date().toISOString()
  };
  
  await writeRaw(db);
  return db.equipment[index];
}

async function remove(id) {
  const db = await readRaw();
  if (!db.equipment) return false;
  
  const index = db.equipment.findIndex(item => String(item._id) === String(id));
  if (index === -1) return false;
  
  db.equipment.splice(index, 1);
  await writeRaw(db);
  return true;
}

// Serve static files
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// API endpoints
app.get('/api/equipment', async (req, res) => {
  try {
    const items = await getAll();
    res.json(items);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

app.get('/api/equipment/:id', async (req, res) => {
  try {
    const item = await getById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

app.post('/api/equipment', async (req, res) => {
  try {
    const newItem = await create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ error: 'Failed to create equipment' });
  }
});

app.put('/api/equipment/:id', async (req, res) => {
  try {
    const updatedItem = await update(req.params.id, req.body);
    if (!updatedItem) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(500).json({ error: 'Failed to update equipment' });
  }
});

app.delete('/api/equipment/:id', async (req, res) => {
  try {
    const deleted = await remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
});

// Health check
app.get('/health', (req, res) => {
  if (req.get('Accept') && req.get('Accept').includes('application/json')) {
    return res.json({ status: 'OK', service: 'FPS Labelisation' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Root route
app.get('/', (req, res) => {
  if (req.get('Accept') && req.get('Accept').includes('application/json')) {
    return res.json({ status: 'OK', service: 'FPS Labelisation' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server listening on http://0.0.0.0:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Static files served from: ${path.join(__dirname, 'public')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📡 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('🔄 Process terminated');
  });
});