// Version ultra-simple pour diagnostic Render
const express = require('express');
const path = require('path');

console.log('🚀 Démarrage version de test...');
console.log('📁 Working directory:', process.cwd());
console.log('🔧 Node version:', process.version);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de base
app.use(express.json());

// Route de test simple
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>FPS Labelisation - Test</title></head>
      <body>
        <h1>🎉 FPS Labelisation fonctionne !</h1>
        <p>Serveur démarré avec succès sur Render</p>
        <p>Version Node.js: ${process.version}</p>
        <p>PORT: ${PORT}</p>
        <p>Working directory: ${process.cwd()}</p>
      </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'FPS Labelisation',
    version: process.version,
    port: PORT,
    cwd: process.cwd()
  });
});

// API de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionne !', timestamp: new Date().toISOString() });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server listening on http://0.0.0.0:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📡 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('🔄 Process terminated');
  });
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});