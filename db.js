const { CosmosClient } = require('@azure/cosmos');

// Configuration Cosmos DB
const endpoint = process.env.COSMOS_ENDPOINT || 'https://localhost:8081';
const key = process.env.COSMOS_KEY || 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=='; // Clé émulateur par défaut
const databaseId = process.env.COSMOS_DATABASE_ID || 'LabelisationDB';
const containerId = process.env.COSMOS_CONTAINER_ID || 'Equipment';

// Initialisation du client Cosmos DB
const client = new CosmosClient({ endpoint, key });

let container;
let isInitialized = false;

/**
 * Initialise la connexion à Cosmos DB et crée la base/container si nécessaire
 */
async function initializeDatabase() {
  if (isInitialized) return container;

  try {
    console.log('🔄 Connexion à Azure Cosmos DB...');
    
    // Créer la base de données si elle n'existe pas
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    console.log(`✅ Base de données: ${databaseId}`);

    // Créer le conteneur avec clé de partition
    const { container: newContainer } = await database.containers.createIfNotExists({
      id: containerId,
      partitionKey: {
        paths: ['/category'], // Partition par catégorie d'équipement
        kind: 'Hash'
      },
      indexingPolicy: {
        automatic: true,
        indexingMode: 'consistent',
        includedPaths: [{ path: '/*' }],
        excludedPaths: [{ path: '/"_etag"/?' }]
      }
    });

    container = newContainer;
    isInitialized = true;
    console.log(`✅ Conteneur: ${containerId}`);
    console.log('✅ Cosmos DB initialisé avec succès');
    
    return container;
  } catch (error) {
    console.error('❌ Erreur initialisation Cosmos DB:', error.message);
    throw error;
  }
}

/**
 * Récupérer tous les équipements
 */
async function getAllEquipment() {
  await initializeDatabase();
  
  const { resources } = await container.items
    .query('SELECT * FROM c ORDER BY c.created_at DESC')
    .fetchAll();
  
  return resources;
}

/**
 * Récupérer un équipement par ID
 */
async function getEquipmentById(id) {
  await initializeDatabase();
  
  const { resources } = await container.items
    .query({
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [{ name: '@id', value: id }]
    })
    .fetchAll();
  
  return resources[0] || null;
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
    category: data.category || 'general', // Clé de partition par défaut
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const { resource } = await container.items.create(newItem);
  return resource;
}

/**
 * Mettre à jour un équipement existant
 */
async function updateEquipment(id, data) {
  await initializeDatabase();
  
  // Récupérer l'item existant pour avoir la partition key
  const existing = await getEquipmentById(id);
  if (!existing) {
    throw new Error('Equipment not found');
  }
  
  const updatedItem = {
    ...existing,
    ...data,
    id: existing.id, // Préserver l'ID
    category: existing.category, // Préserver la partition key
    created_at: existing.created_at, // Préserver la date de création
    updated_at: new Date().toISOString()
  };
  
  const { resource } = await container.item(id, existing.category).replace(updatedItem);
  return resource;
}

/**
 * Supprimer un équipement
 */
async function deleteEquipment(id) {
  await initializeDatabase();
  
  // Récupérer l'item pour avoir la partition key
  const existing = await getEquipmentById(id);
  if (!existing) {
    throw new Error('Equipment not found');
  }
  
  await container.item(id, existing.category).delete();
  return { success: true };
}

/**
 * Compter le nombre total d'équipements
 */
async function countEquipment() {
  await initializeDatabase();
  
  const { resources } = await container.items
    .query('SELECT VALUE COUNT(1) FROM c')
    .fetchAll();
  
  return resources[0] || 0;
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
