# 📘 Book Review API

This is a basic Book Review REST API built using Node.js, Express, and MySQL. It allows users to sign up, log in, add books, write reviews, and search for books. JWT is used for authentication.

---

## 🔧 Project Setup Instructions

1. Clone the repository

bash
git clone https://github.com/your-username/book-review-api.git
cd book-review-api

Install dependencies

npm install

Create a .env file and add your environment variables:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=book_review
JWT_SECRET=your_jwt_secret

Set up MySQL:

Open MySQL and run the SQL file to create the database and tables.

The SQL file includes all CREATE TABLE queries.

Run the server:
npm start


🧪 How to Run Locally
Make sure MySQL is running.

Start the server: npm start

Use Postman or curl to test the API.

For routes that require login, use the token returned after login in the Authorization header.

📮 Example API Requests (Postman or curl)
🔐 Signup

POST /signup

{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}

🔓 Login

POST /login

{
  "email": "john@example.com",
  "password": "123456"
}

📚 Add Book (Requires token)

POST /books

{
  "title": "Atomic Habits",
  "author": "James Clear",
  "genre": "Self-help"
}

📖 Get All Books
GET /books?page=1&author=James%20Clear&genre=Self-help

📝 Add Review (Requires token)

POST /books/:id/reviews

{
  "rating": 5,
  "comment": "Amazing book!"
}


🔍 Search Books

GET /search?query=habits

📐 Database Schema

users

| Field    | Type                 |
| -------- | -------------------- |
| id       | INT, PK, AI          |
| name     | VARCHAR(100)         |
| email    | VARCHAR(100), UNIQUE |
| password | VARCHAR(255)         |

books

| Field       | Type               |
| ----------- | ------------------ |
| id          | INT, PK, AI        |
| title       | VARCHAR(255)       |
| author      | VARCHAR(255)       |
| genre       | VARCHAR(100)       |
| created\_by | INT, FK → users.id |

reviews

| Field    | Type               |
| -------- | ------------------ |
| id       | INT, PK, AI        |
| user\_id | INT, FK → users.id |
| book\_id | INT, FK → books.id |
| rating   | INT (1–5)          |
| comment  | TEXT               |


💡 Design Decisions & Assumptions
JWT is used for authentication.

One user can only review a book once.

Ratings must be integers between 1 and 5.

Users can only update or delete their own reviews.

Search works by matching partial text in title or author.

Pagination is supported for book list and reviews.


