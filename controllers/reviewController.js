// Importing the database connection module
const db = require("../models/db");

// Add a review for a book by a user
exports.addReview = (req, res) => {
  const bookId = req.params.id; // Get the book ID from the request parameters
  const { rating, comment } = req.body; // Extract rating and comment from the request body
  const userId = req.user.id; // Get the user ID from the authenticated user

  // Query to check if the user has already reviewed this book
  db.query(
    "SELECT * FROM reviews WHERE book_id = ? AND user_id = ?",
    [bookId, userId],
    (err, results) => {
      if (results.length > 0)
        return res
          .status(400)
          .json({ error: "You already reviewed this book" }); // Prevent duplicate reviews from the same user

      // Query to insert the new review into the reviews table
      db.query(
        "INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
        [bookId, userId, rating, comment], // Insert the review with book ID, user ID, rating, and comment
        (err) => {
          if (err) return res.status(500).json({ error: "DB error" }); // Handle DB error
          res.json({ message: "Review added" }); // Send success response
        }
      );
    }
  );
};

// Update an existing review for a book
exports.updateReview = (req, res) => {
  const reviewId = req.params.id; // Get the review ID from the request parameters
  const userId = req.user.id; // Get the user ID from the authenticated user
  const { rating, comment } = req.body; // Extract updated rating and comment from the request body

  // Query to check if the review exists
  db.query("SELECT * FROM reviews WHERE id = ?", [reviewId], (err, results) => {
    if (results[0]?.user_id !== userId)
      return res.status(403).json({ error: "Forbidden" }); // Ensure that the user is updating their own review

    // Query to update the review with the new rating and comment
    db.query(
      "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
      [rating, comment, reviewId], // Update the review with new data
      (err) => {
        if (err) return res.status(500).json({ error: "DB error" }); // Handle DB error
        res.json({ message: "Review updated" }); // Send success response
      }
    );
  });
};

// Delete a review for a book
exports.deleteReview = (req, res) => {
  const reviewId = req.params.id; // Get the review ID from the request parameters
  const userId = req.user.id; // Get the user ID from the authenticated user

  // Query to check if the review exists
  db.query("SELECT * FROM reviews WHERE id = ?", [reviewId], (err, results) => {
    if (results[0]?.user_id !== userId)
      return res.status(403).json({ error: "Forbidden" }); // Ensure that the user is deleting their own review

    // Query to delete the review from the reviews table
    db.query("DELETE FROM reviews WHERE id = ?", [reviewId], (err) => {
      if (err) return res.status(500).json({ error: "DB error" }); // Handle DB error
      res.json({ message: "Review deleted" }); // Send success response
    });
  });
};
