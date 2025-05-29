// Importing necessary libraries
const mysql = require("mysql2");
const dotenv = require("dotenv");

// Load environment variables from .env file to use database credentials securely
dotenv.config();

// Create a connection to the MySQL database using values from the environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,        // Database host (e.g., localhost or IP address)
  user: process.env.DB_USER,        // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME,    // Name of the database to connect to
});

// Attempt to connect to the database
db.connect((err) => {
  // If there's an error during the connection, log it to the console
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  // If connection is successful, log a success message
  console.log("Connected to the database");
});

// Export the db connection object to use it in other parts of the application
module.exports = db;
