// Importing the database connection module
const db = require("../models/db");

// Add a new book to the database
exports.addBook = (req, res) => {
  const { title, author, genre } = req.body; // Extract book details from the request body

  // Query to insert a new book into the books table
  db.query(
    "INSERT INTO books (title, author, genre) VALUES (?, ?, ?)", // SQL query to insert book
    [title, author, genre], // Values to insert (book title, author, genre)
    (err) => {
      if (err) return res.status(500).json({ error: "DB error" }); // Handle database error
      res.json({ message: "Book added" }); // Send success response
    }
  );
};

// Get a list of books with optional filters for pagination, author, and genre
exports.getBooks = (req, res) => {
  const { page = 1, limit = 5, author, genre } = req.query; // Extract query parameters for pagination and filters
  const offset = (page - 1) * limit; // Calculate the offset based on the current page
  let query = "SELECT * FROM books WHERE 1"; // Initial query to fetch all books
  const values = []; // Array to hold query parameter values

  // Add filter for author if provided in the query
  if (author) {
    query += " AND author LIKE ?";
    values.push(`%${author}%`); // Add author filter value (partial match)
  }

  // Add filter for genre if provided in the query
  if (genre) {
    query += " AND genre = ?";
    values.push(genre); // Add genre filter value
  }

  query += " LIMIT ? OFFSET ?"; // Apply pagination to the query
  values.push(parseInt(limit), parseInt(offset)); // Add limit and offset values to the query parameters

  // Execute the query to fetch books with applied filters
  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" }); // Handle database error
    res.json(results); // Return the list of books
  });
};

// Get details of a specific book by its ID
exports.getBookById = (req, res) => {
  const bookId = req.params.id; // Extract book ID from the route parameter

  // Query to fetch the book details by ID
  db.query("SELECT * FROM books WHERE id = ?", [bookId], (err, books) => {
    if (err || books.length === 0)
      return res.status(404).json({ error: "Book not found" }); // Return error if book not found

    // Query to fetch the average rating for the book from the reviews table
    db.query(
      "SELECT AVG(rating) as avgRating FROM reviews WHERE book_id = ?",
      [bookId],
      (err, avgResult) => {
        // Query to fetch reviews for the book
        db.query(
          "SELECT * FROM reviews WHERE book_id = ? LIMIT 10",
          [bookId],
          (err, reviews) => {
            // Send the book details, average rating, and reviews as the response
            res.json({
              ...books[0], // Spread the book details
              avgRating: avgResult[0].avgRating || 0, // Include average rating (0 if no ratings)
              reviews, // Include reviews for the book
            });
          }
        );
      }
    );
  });
};

// Search for books by title or author
exports.searchBooks = (req, res) => {
  const { q } = req.query; // Extract the search query from the request

  // Query to search for books where title or author matches the search query
  db.query(
    "SELECT * FROM books WHERE title LIKE ? OR author LIKE ?",
    [`%${q}%`, `%${q}%`], // Use wildcards for partial matching
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" }); // Handle database error
      res.json(results); // Return the search results
    }
  );
};
