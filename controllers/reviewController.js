const db = require("../models/db");

exports.addReview = (req, res) => {
  const bookId = req.params.id;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  db.query(
    "SELECT * FROM reviews WHERE book_id = ? AND user_id = ?",
    [bookId, userId],
    (err, results) => {
      if (results.length > 0)
        return res
          .status(400)
          .json({ error: "You already reviewed this book" });

      db.query(
        "INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
        [bookId, userId, rating, comment],
        (err) => {
          if (err) return res.status(500).json({ error: "DB error" });
          res.json({ message: "Review added" });
        }
      );
    }
  );
};

exports.updateReview = (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;
  const { rating, comment } = req.body;

  db.query("SELECT * FROM reviews WHERE id = ?", [reviewId], (err, results) => {
    if (results[0]?.user_id !== userId)
      return res.status(403).json({ error: "Forbidden" });

    db.query(
      "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
      [rating, comment, reviewId],
      (err) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json({ message: "Review updated" });
      }
    );
  });
};

exports.deleteReview = (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  db.query("SELECT * FROM reviews WHERE id = ?", [reviewId], (err, results) => {
    if (results[0]?.user_id !== userId)
      return res.status(403).json({ error: "Forbidden" });

    db.query("DELETE FROM reviews WHERE id = ?", [reviewId], (err) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json({ message: "Review deleted" });
    });
  });
};
