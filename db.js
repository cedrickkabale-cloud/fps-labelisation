const { sql } = require('@vercel/postgres');

let isInitialized = false;

/**
 * Initialise la base de données Vercel Postgres
 * Crée la table equipment si elle n'existe pas
 */
async function initializeDatabase() {
  if (isInitialized) return;

  try {
    console.log('🔄 Initialisation de Vercel Postgres...');
    
    // Créer la table equipment si elle n'existe pas
    await sql`
      CREATE TABLE IF NOT EXISTS equipment (
        id TEXT PRIMARY KEY,
        code_compte TEXT,
        designation TEXT,
        numero_serie TEXT,
        category TEXT,
        etat TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Vercel Postgres initialisé');
    isInitialized = true;
  } catch (error) {
    console.error('❌ Erreur initialisation Postgres:', error.message);
    throw error;
  }
}

/**
 * Récupérer tous les équipements
 */
async function getAllEquipment() {
  await initializeDatabase();
  
  const { rows } = await sql`
    SELECT * FROM equipment 
    ORDER BY created_at DESC
  `;
  
  return rows;
}

/**
 * Récupérer un équipement par ID
 */
async function getEquipmentById(id) {
  await initializeDatabase();
  
  const { rows } = await sql`
    SELECT * FROM equipment 
    WHERE id = ${id}
  `;
  
  return rows[0] || null;
}

/**
 * Créer un nouvel équipement
 */
async function createEquipment(data) {
  await initializeDatabase();
  
  // Générer un ID unique basé sur le timestamp et random
  const id = `EQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const { rows } = await sql`
    INSERT INTO equipment (
      id, 
      code_compte, 
      designation, 
      numero_serie, 
      category, 
      etat,
      created_at,
      updated_at
    )
    VALUES (
      ${id},
      ${data.code_compte || null},
      ${data.designation || null},
      ${data.numero_serie || null},
      ${data.category || null},
      ${data.etat || null},
      NOW(),
      NOW()
    )
    RETURNING *
  `;
  
  return rows[0];
}

/**
 * Mettre à jour un équipement existant
 */
async function updateEquipment(id, data) {
  await initializeDatabase();
  
  const { rows } = await sql`
    UPDATE equipment 
    SET 
      code_compte = ${data.code_compte || null},
      designation = ${data.designation || null},
      numero_serie = ${data.numero_serie || null},
      category = ${data.category || null},
      etat = ${data.etat || null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  
  if (rows.length === 0) {
    throw new Error('Equipment not found');
  }
  
  return rows[0];
}

/**
 * Supprimer un équipement
 */
async function deleteEquipment(id) {
  await initializeDatabase();
  
  const { rowCount } = await sql`
    DELETE FROM equipment 
    WHERE id = ${id}
  `;
  
  if (rowCount === 0) {
    throw new Error('Equipment not found');
  }
  
  return { success: true };
}

/**
 * Compter le nombre total d'équipements
 */
async function countEquipment() {
  await initializeDatabase();
  
  const { rows } = await sql`
    SELECT COUNT(*) as count FROM equipment
  `;
  
  return parseInt(rows[0].count);
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
