const mysql = require('mysql2');
const util = require('util');

// Load environment variables from .env file
require('dotenv').config();

// Create a database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Promisify the query method to use async/await
const query = util.promisify(connection.query).bind(connection);

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    process.exit(1); // Exit the process if connection fails
  }
  console.log('Connected to the database.');
});


/**
 * Function to execute a SQL query
 * @param {string} sql - The SQL query string
 * @param {Array} [params] - The parameters for the query
 * @returns {Promise<Array>} - A promise that resolves with the query results
 */

const runQuery = async (sql, params = []) => {
  console.log(sql);
  console.log(params);
    try {
      const results = await query(sql, params);
      console.log("query executed", results);
      return {status: true, value: results};
    } catch (error) {
      console.log(error);
      return { message: error.message, status: false};
    }
};

module.exports = {
    runQuery
}
