const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

// POST request: Create a new book
public_users.post("/register", (req, res) => {
    const { author, title, review, isbn } = req.query;
    books[isbn] = { author, title, review, isbn };
    res.send(`The book ${title} has been added!`);
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(books);
});

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
        res.json({ booksByTitle });
    } else {
        res.status(404).json({ message: "No books found for the provided title" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.send(JSON.stringify({ book }, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify({ booksByAuthor }, null, 4));
    } else {
        res.status(404).json({ message: "No books found for the provided author" });
    }
});

// Get book details based on review
public_users.get('/review/:review', function (req, res) {
    const review = req.params.review;
    const booksWithReview = Object.values(books).filter(book => book.review === review);
    if (booksWithReview.length > 0) {
        res.send(JSON.stringify({ booksWithReview }, null, 4));
    } else {
        res.status(404).json({ message: "No books found with the provided review" });
    }
});

module.exports.general = public_users;
