const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DATABASE || 'LabelisationDB';

let client;
let db;
let collection;

async function initializeDatabase() {
  if (db) return;

  try {
    console.log('🔄 Connexion MongoDB local...');
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000
    });
    await client.connect();
    db = client.db(dbName);
    collection = db.collection('equipment');
    console.log('✅ MongoDB connecté !');
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    throw error;
  }
}

async function getAllEquipment() {
  await initializeDatabase();
  const items = await collection.find({}).sort({ created_at: -1 }).toArray();
  return items.map(item => ({ id: item.id, ...item }));
}

async function getEquipmentById(id) {
  await initializeDatabase();
  const item = await collection.findOne({ id });
  return item;
}

async function createEquipment(data) {
  await initializeDatabase();
  const id = `EQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const item = {
    id,
    ...data,
    created_at: new Date(),
    updated_at: new Date()
  };
  await collection.insertOne(item);
  return item;
}

async function updateEquipment(id, data) {
  await initializeDatabase();
  const result = await collection.findOneAndUpdate(
    { id },
    { $set: { ...data, updated_at: new Date() } },
    { returnDocument: 'after' }
  );
  if (!result) throw new Error('Equipment not found');
  return result;
}

async function deleteEquipment(id) {
  await initializeDatabase();
  const result = await collection.deleteOne({ id });
  if (result.deletedCount === 0) throw new Error('Equipment not found');
  return { success: true };
}

async function countEquipment() {
  await initializeDatabase();
  return await collection.countDocuments();
}

module.exports = {
  initializeDatabase,
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  countEquipment
};
