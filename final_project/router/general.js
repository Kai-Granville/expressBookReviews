const express = require('express');
const axios = require('axios'); // Import Axios for making HTTP requests
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

// Get the book list available in the shop using async-await with Axios
publicUsers.get('/', async function (req, res) {
    try {
        const response = await axios.get('https://kaig2002-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
        const books = response.data;
        res.json({ books });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get book details based on title using async-await with Axios
publicUsers.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const response = await axios.get(`https://kaig2002-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`); // Replace with your server URL
        const booksByTitle = response.data.booksByTitle;
        if (booksByTitle && booksByTitle.length > 0) {
            res.json({ booksByTitle });
        } else {
            res.status(404).json({ message: "No books found for the provided title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get book details based on ISBN using async-await with Axios
publicUsers.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`https://kaig2002-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`); // Replace with your server URL
        const book = response.data.book;
        if (book) {
            res.send(JSON.stringify({ book }, null, 4));
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
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
