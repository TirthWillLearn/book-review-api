const express = require("express");
const router = express.Router();

// Importing authentication middleware to protect certain routes
const auth = require("../middlewares/authMiddleware");

// Importing controller functions to handle book-related requests
const {
  addBook,        // To add a new book
  getBooks,       // To get a list of books
  getBookById,    // To get a specific book by its ID
  searchBooks,    // To search books based on a query
} = require("../controllers/bookController");

// Route to add a book (Protected route, requires authentication)
router.post("/books", auth, addBook);

// Route to get a list of books (Public route)
router.get("/books", getBooks);

// Route to get a specific book by its ID (Public route)
router.get("/books/:id", getBookById);

// Route to search for books based on title or author (Public route)
router.get("/search", searchBooks);

// Export the router to be used in the main server file
module.exports = router;
