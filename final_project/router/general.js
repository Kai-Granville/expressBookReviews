const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// POST request: Create a new book
public_users.post("/register", (req,res) => {
    books.push({"author":req.query.author,"title":req.query.title,"review":req.query.review});
    res.send("The book" + (' ')+ (req.query.title) + " Has been added!")
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    // Find the book with the provided ISBN
    const book = books.find(book => book.isbn === isbn);
    if (book) {
        res.send(JSON.stringify({ book }, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    // Filter books by author
    const booksByAuthor = books.filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify({ booksByAuthor }, null, 4));
    } else {
        res.status(404).json({ message: "No books found for the provided author" });
    }
});

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    // Filter books by title
    const booksByTitle = books.filter(book => book.title === title);
    if (booksByTitle.length > 0) {
        res.send(JSON.stringify({ booksByTitle }, null, 4));
    } else {
        res.status(404).json({ message: "No books found for the provided title" });
    }
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    // Find the book with the provided ISBN
    const book = books.find(book => book.isbn === isbn);
    if (book) {
        const reviews = book.reviews || {}; // If reviews are not available, default to an empty object
        res.send(JSON.stringify({ reviews }, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;
