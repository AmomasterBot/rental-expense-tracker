require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');

// Import routes
const propertiesRouter = require('./routes/properties');
const expensesRouter = require('./routes/expenses');
const filesRouter = require('./routes/files');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Rental Expense Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/properties', propertiesRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/files', filesRouter);
app.post('/api/upload', filesRouter);

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`✓ Rental Expense Tracker API running on http://localhost:${PORT}`);
      console.log(`✓ Database initialized`);
      console.log(`✓ Available endpoints:`);
      console.log(`  - GET  /health`);
      console.log(`  - GET  /api/properties`);
      console.log(`  - POST /api/properties`);
      console.log(`  - GET  /api/properties/:id`);
      console.log(`  - PUT  /api/properties/:id`);
      console.log(`  - DELETE /api/properties/:id`);
      console.log(`  - GET  /api/expenses`);
      console.log(`  - POST /api/expenses`);
      console.log(`  - GET  /api/expenses/:id`);
      console.log(`  - PUT  /api/expenses/:id`);
      console.log(`  - DELETE /api/expenses/:id`);
      console.log(`  - GET  /api/expenses/property/:property_id`);
      console.log(`  - POST /api/upload`);
      console.log(`  - GET  /api/files`);
      console.log(`  - GET  /api/files/:id`);
      console.log(`  - DELETE /api/files/:id`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});
