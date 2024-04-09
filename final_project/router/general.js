const express = require('express');
const authUsers = require("./auth_users.js"); // Import the entire module
let books = require("./booksdb.js");
const publicUsers = express.Router();

// POST request: Create a new book
publicUsers.post("/books", (req, res) => {
    const { author, title, review, isbn } = req.body;

    // Check if required book details are provided
    if (!author || !title || !isbn) {
        return res.status(400).json({ message: "Author, title, and ISBN are required" });
    }

    // Check if the book already exists
    if (books[isbn]) {
        return res.status(400).json({ message: "Book with the same ISBN already exists" });
    }

    // Add the new book to the books database
    books[isbn] = { author, title, review, isbn };

    // Respond with a success message
    return res.status(201).json({ message: `The book ${title} has been added!` });
});

// Get the book list available in the shop
publicUsers.get('/', function (req, res) {
    res.send(books);
});

// Get book details based on title
publicUsers.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
        res.json({ booksByTitle });
    } else {
        res.status(404).json({ message: "No books found for the provided title" });
    }
});

// Get book details based on ISBN
publicUsers.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.send(JSON.stringify({ book }, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
publicUsers.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify({ booksByAuthor }, null, 4));
    } else {
        res.status(404).json({ message: "No books found for the provided author" });
    }
});

// Get reviews for a book based on ISBN
publicUsers.get('/reviews/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        if (Object.keys(book.reviews).length > 0) {
            res.json({ reviews: book.reviews });
        } else {
            res.status(404).json({ message: "No reviews found for the provided book" });
        }
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Delete a book by ISBN
publicUsers.delete('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const bookDeleted = deleteBook(isbn);
    if (bookDeleted) {
        res.status(200).json({ message: "Book deleted successfully" });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = publicUsers;
