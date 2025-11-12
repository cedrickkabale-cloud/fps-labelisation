// Fichier de démarrage pour Render
// Charge le serveur principal depuis le dossier server

const path = require('path');

console.log('🚀 Démarrage de l\'application FPS Labelisation...');
console.log('📁 Répertoire de travail:', process.cwd());
console.log('🔧 Version Node.js:', process.version);

try {
  // Charger le serveur principal en spécifiant le chemin complet
  const serverPath = path.join(__dirname, 'server', 'server.js');
  console.log('📂 Chargement du serveur depuis:', serverPath);
  
  require(serverPath);
  
} catch (error) {
  console.error('❌ Erreur lors du chargement du serveur:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}