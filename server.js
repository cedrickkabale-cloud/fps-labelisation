// Fichier de démarrage pour Render
// Redirige vers le serveur principal dans le dossier server

const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 Démarrage de l\'application FPS Labelisation...');
console.log('📁 Répertoire de travail:', process.cwd());
console.log('🔧 Version Node.js:', process.version);

// Changer vers le répertoire server
const serverPath = path.join(__dirname, 'server');
console.log('📂 Répertoire du serveur:', serverPath);

// Démarrer le serveur principal
const serverProcess = spawn('node', ['server.js'], {
  cwd: serverPath,
  stdio: 'inherit',
  env: { ...process.env }
});

serverProcess.on('error', (error) => {
  console.error('❌ Erreur lors du démarrage du serveur:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`🔄 Le serveur s'est arrêté avec le code: ${code}`);
  process.exit(code);
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
  console.log('📡 Signal SIGTERM reçu, arrêt du serveur...');
  serverProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('⚡ Signal SIGINT reçu, arrêt du serveur...');
  serverProcess.kill('SIGINT');
});