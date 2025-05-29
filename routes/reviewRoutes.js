const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/books/:id/reviews", auth, addReview);
router.put("/reviews/:id", auth, updateReview);
router.delete("/reviews/:id", auth, deleteReview);

module.exports = router;
