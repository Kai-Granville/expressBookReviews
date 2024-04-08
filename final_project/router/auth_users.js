const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// let users = [];

const users = [
    { username: "user1", password: "user1" },
    { username: "user2", password: "user2" },
    // Add more user objects as needed
];

const isValid = (username) => {
    // Check if the username exists in the list of users
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    // Find a user with the provided username
    const user = users.find(user => user.username === username);
    
    // If user is not found or password does not match, return false
    if (!user || user.password !== password) {
        return false;
    }
    
    // If username and password match, return true
    return true;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;

    // Find the book with the provided ISBN
    const book = books.find(book => book.isbn === isbn);

    if (book) {
        // Update the book's reviews with the new review
        book.reviews = book.reviews || {}; // Ensure reviews object exists
        book.reviews[Date.now()] = review; // Using timestamp as review key

        return res.status(200).json({ message: "Review added successfully" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
