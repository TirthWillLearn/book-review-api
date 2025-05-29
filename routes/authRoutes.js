// Importing necessary modules
const express = require("express");
const router = express.Router();  // Create an Express router to handle routes
const { signup, login } = require("../controllers/authController");  // Importing signup and login functions from authController

// Route for user signup
// When a POST request is made to '/signup', the signup function will be executed
router.post("/signup", signup);

// Route for user login
// When a POST request is made to '/login', the login function will be executed
router.post("/login", login);

// Export the router so it can be used in the main app file
module.exports = router;
