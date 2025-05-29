const db = require("../models/db");

exports.addBook = (req, res) => {
  const { title, author, genre } = req.body;
  db.query(
    "INSERT INTO books (title, author, genre) VALUES (?, ?, ?)",
    [title, author, genre],
    (err) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json({ message: "Book added" });
    }
  );
};

exports.getBooks = (req, res) => {
  const { page = 1, limit = 5, author, genre } = req.query;
  const offset = (page - 1) * limit;
  let query = "SELECT * FROM books WHERE 1";
  const values = [];

  if (author) {
    query += " AND author LIKE ?";
    values.push(`%${author}%`);
  }
  if (genre) {
    query += " AND genre = ?";
    values.push(genre);
  }

  query += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit), parseInt(offset));

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(results);
  });
};

exports.getBookById = (req, res) => {
  const bookId = req.params.id;

  db.query("SELECT * FROM books WHERE id = ?", [bookId], (err, books) => {
    if (err || books.length === 0)
      return res.status(404).json({ error: "Book not found" });

    db.query(
      "SELECT AVG(rating) as avgRating FROM reviews WHERE book_id = ?",
      [bookId],
      (err, avgResult) => {
        db.query(
          "SELECT * FROM reviews WHERE book_id = ? LIMIT 10",
          [bookId],
          (err, reviews) => {
            res.json({
              ...books[0],
              avgRating: avgResult[0].avgRating || 0,
              reviews,
            });
          }
        );
      }
    );
  });
};

exports.searchBooks = (req, res) => {
  const { q } = req.query;
  db.query(
    "SELECT * FROM books WHERE title LIKE ? OR author LIKE ?",
    [`%${q}%`, `%${q}%`],
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json(results);
    }
  );
};
