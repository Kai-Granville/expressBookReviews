const express = require('express');
const regd_users = express.Router();
const { isValid, users } = require("./booksdb.js"); // Import users and isValid from booksdb.js

// Function to create a new user
const createUser = (username, password) => {
    if (!isValid(username)) {
        users.push({ username, password });
        return true; // User created successfully
    } else {
        return false; // User already exists
    }
};

// Add a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    console.log("starting function")
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    console.log("cred inputted")
    console.log("starting to create user")
    const userCreated = createUser(username, password);
    if (userCreated) {
        return res.status(201).json({ message: "User created successfully" });
    } else {
        return res.status(400).json({ message: "User already exists" });
    }
});

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if the provided username exists and the password is correct
    if (!username || !password || !authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const accessToken = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });

    // Send the token in the response
    return res.status(200).json({ accessToken });
});


module.exports.authenticated = regd_users;
