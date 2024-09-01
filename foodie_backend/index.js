// index.js

// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors')
// Import routes
const indexRoute = require('./src/routes/indexRoute');
// const authRoutes = require('./routes/authRoutes');



// Create an Express application
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies

// Routes
app.use(cors());
app.use('/',indexRoute);
// app.use('/api/auth', authRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});

// Export the connection for use in other parts of the application
require('./src/db_operations/sql_operations'); // Ensure the database connection is established when the app starts

// module.exports = connection;
