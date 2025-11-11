const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static client files
app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// API endpoints
app.get('/api/equipment', async (req, res) => {
  try {
    const items = await db.getAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/equipment', async (req, res) => {
  try {
    const item = req.body;
    if (!item || !item.asset_id) {
      return res.status(400).json({ success: false, error: 'asset_id missing' });
    }
    const created = await db.add(item);
    res.json({ success: true, item: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint to reset/initialize DB (POST body can include initial JSON)
app.post('/api/db/init', async (req, res) => {
  try {
    const initial = req.body && Object.keys(req.body).length ? req.body : undefined;
    const result = await db.reset(initial);
    res.json({ success: true, db: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update an equipment by _id
app.put('/api/equipment/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const patch = req.body;
    const updated = await db.update(id, patch);
    if (!updated) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, item: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete an equipment by _id
app.delete('/api/equipment/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const ok = await db.remove(id);
    if (!ok) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Simple health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
