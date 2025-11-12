const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('Starting FPS Labelisation server...');

// Middleware minimal
app.use(express.json());
app.use(express.static('public'));

// Test route
app.get('/', (req, res) => {
  res.send(`
    <h1>FPS Labelisation - ONLINE!</h1>
    <p>Server is running on port ${PORT}</p>
    <p>Node version: ${process.version}</p>
    <a href="/api/test">Test API</a>
  `);
});

app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
});