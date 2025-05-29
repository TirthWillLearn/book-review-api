// Importing necessary modules
const db = require("../models/db"); // Database connection
const bcrypt = require("bcryptjs"); // Library for hashing passwords
const jwt = require("jsonwebtoken"); // Library for generating JWT tokens

// Signup function to register a new user
exports.signup = async (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  // Hash the password using bcrypt before saving it to the database
  const hashed = await bcrypt.hash(password, 10);

  // Insert the new user into the database
  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)", // SQL query to insert a new user
    [username, hashed], // Values to insert (username and hashed password)
    (err) => {
      if (err)
        // If an error occurs (e.g., duplicate username), return an error response
        return res.status(400).json({ error: "Username may already exist" });

      // If user is successfully registered, return success message
      res.json({ message: "User registered" });
    }
  );
};

// Login function to authenticate the user
exports.login = (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  // Query the database to check if the username exists
  db.query(
    "SELECT * FROM users WHERE username = ?", // SQL query to find the user by username
    [username], // Value to check (username)
    async (err, results) => {
      if (err || results.length === 0)
        // If no user found or error occurs, return an invalid credentials error
        return res.status(401).json({ error: "Invalid credentials" });

      // Compare the provided password with the stored hashed password
      const valid = await bcrypt.compare(password, results[0].password);
      if (!valid)
        // If the password doesn't match, return invalid credentials error
        return res.status(401).json({ error: "Invalid credentials" });

      // Generate a JWT token to authenticate the user in future requests
      const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, {
        expiresIn: "1d", // Token expires in 1 day
      });

      // Return the generated token to the user
      res.json({ token });
    }
  );
};
