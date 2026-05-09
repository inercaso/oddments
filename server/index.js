require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { setupSwagger } = require('./swagger');

// Import db early so schema is created and seed runs before routes
require('./db');

const app = express();

app.use(cors({
  origin: true, // reflect any origin — fine for a local demo
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' })); // images can be data URIs

setupSwagger(app);

app.use('/token',           require('./routes/token'));
app.use('/api/curiosities', require('./routes/curiosities'));
app.use('/api/collections', require('./routes/collections'));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Oddments API running at http://localhost:${PORT}`);
  console.log(`Swagger UI:           http://localhost:${PORT}/api-docs`);
});
