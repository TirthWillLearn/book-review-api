// Importing the necessary libraries
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load environment variables from a .env file
dotenv.config();

// Middleware to check for JWT token in the request header
const authMiddleware = (req, res, next) => {
  // Get the token from the 'Authorization' header (typically 'Bearer token_value')
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token part after "Bearer"

  // If no token is provided, return a 401 Unauthorized error
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user info to the request object for later use
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch {
    // If token is invalid or verification fails, return a 400 Bad Request error
    res.status(400).json({ error: "Invalid token" });
  }
};

// Export the middleware so it can be used in other files
module.exports = authMiddleware;
