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
public_users.get('/isbn/:isbn',function (req, res) {
  res.send(JSON.stringify({books},null,4));
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  res.send(JSON.stringify({books},null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  res.send(JSON.stringify({books},null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.send(JSON.stringify({books},null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
