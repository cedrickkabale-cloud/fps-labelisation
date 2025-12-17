const { MongoClient } = require('mongodb');

// Configuration MongoDB Atlas
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DATABASE || 'LabelisationDB';
const collectionName = 'equipment';

// Client MongoDB
let client;
let db;
let collection;
let isInitialized = false;

/**
 * Initialise la connexion à MongoDB Atlas
 */
async function initializeDatabase() {
  if (isInitialized) return collection;

  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    
    // Créer le client et se connecter
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    await client.connect();
    console.log('✅ Connecté à MongoDB Atlas');
    
    // Accéder à la base de données et la collection
    db = client.db(dbName);
    collection = db.collection(collectionName);
    
    // Créer un index sur le champ id pour les recherches rapides
    await collection.createIndex({ id: 1 }, { unique: true });
    console.log(`✅ Base de données: ${dbName}`);
    console.log(`✅ Collection: ${collectionName}`);
    
    isInitialized = true;
    return collection;
  } catch (error) {
    console.error('❌ Erreur initialisation MongoDB:', error.message);
    throw error;
  }
}

/**
 * Récupérer tous les équipements
 */
async function getAllEquipment() {
  await initializeDatabase();
  
  const equipment = await collection
    .find({})
    .sort({ created_at: -1 })
    .toArray();
  
  return equipment;
}

/**
 * Récupérer un équipement par ID
 */
async function getEquipmentById(id) {
  await initializeDatabase();
  
  const item = await collection.findOne({ id });
  return item;
}

/**
 * Créer un nouvel équipement
 */
async function createEquipment(data) {
  await initializeDatabase();
  
  // Générer un ID unique basé sur le timestamp et random
  const id = `EQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newItem = {
    id,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  await collection.insertOne(newItem);
  return newItem;
}

/**
 * Mettre à jour un équipement existant
 */
async function updateEquipment(id, data) {
  await initializeDatabase();
  
  // Vérifier que l'équipement existe
  const existing = await getEquipmentById(id);
  if (!existing) {
    throw new Error('Equipment not found');
  }
  
  const updatedItem = {
    ...existing,
    ...data,
    id: existing.id, // Préserver l'ID
    created_at: existing.created_at, // Préserver la date de création
    updated_at: new Date().toISOString()
  };
  
  await collection.updateOne(
    { id },
    { $set: updatedItem }
  );
  
  return updatedItem;
}

/**
 * Supprimer un équipement
 */
async function deleteEquipment(id) {
  await initializeDatabase();
  
  // Vérifier que l'équipement existe
  const existing = await getEquipmentById(id);
  if (!existing) {
    throw new Error('Equipment not found');
  }
  
  await collection.deleteOne({ id });
  return { success: true };
}

/**
 * Compter le nombre total d'équipements
 */
async function countEquipment() {
  await initializeDatabase();
  
  const count = await collection.countDocuments();
  return count;
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
