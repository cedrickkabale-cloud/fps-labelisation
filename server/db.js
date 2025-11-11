const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');
const DEFAULT_DB = { lastId: 0, equipment: [] };

async function readRaw() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // If file doesn't exist or is invalid, return default
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

async function add(item) {
  const db = await readRaw();
  db.lastId = (db.lastId || 0) + 1;
  item._id = db.lastId;
  item.created_at = new Date().toISOString();
  db.equipment = db.equipment || [];
  db.equipment.push(item);
  await writeRaw(db);
  return item;
}

async function update(id, patch) {
  const db = await readRaw();
  db.equipment = db.equipment || [];
  const idx = db.equipment.findIndex(i => String(i._id) === String(id));
  if (idx === -1) return null;
  db.equipment[idx] = { ...db.equipment[idx], ...patch };
  await writeRaw(db);
  return db.equipment[idx];
}

async function remove(id) {
  const db = await readRaw();
  const before = (db.equipment || []).length;
  db.equipment = (db.equipment || []).filter(i => String(i._id) !== String(id));
  if (db.equipment.length === before) return false;
  await writeRaw(db);
  return true;
}

async function reset(initial = DEFAULT_DB) {
  const copy = JSON.parse(JSON.stringify(initial));
  await writeRaw(copy);
  return copy;
}

module.exports = {
  readRaw,
  writeRaw,
  getAll,
  getById,
  add,
  update,
  remove,
  reset,
};
