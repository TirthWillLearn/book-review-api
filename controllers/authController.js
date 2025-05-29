const db = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashed],
    (err) => {
      if (err)
        return res.status(400).json({ error: "Username may already exist" });
      res.json({ message: "User registered" });
    }
  );
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err || results.length === 0)
        return res.status(401).json({ error: "Invalid credentials" });

      const valid = await bcrypt.compare(password, results[0].password);
      if (!valid) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.json({ token });
    }
  );
};
