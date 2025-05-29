const express = require("express");
const router = express.Router();

// Importing authentication middleware to protect routes
const auth = require("../middlewares/authMiddleware");

// Importing controller functions to handle review-related requests
const {
  addReview,    // To add a review to a book
  updateReview, // To update an existing review
  deleteReview, // To delete a review
} = require("../controllers/reviewController");

// Route to add a review for a book (Protected route, requires authentication)
router.post("/books/:id/reviews", auth, addReview);

// Route to update an existing review (Protected route, requires authentication)
router.put("/reviews/:id", auth, updateReview);

// Route to delete a review (Protected route, requires authentication)
router.delete("/reviews/:id", auth, deleteReview);

// Export the router to be used in the main server file
module.exports = router;
