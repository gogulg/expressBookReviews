const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }
    if (users[username]) {
        return res.status(409).json({ message: "User already exists" });
    }
    users[username] = { username, password };
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const allBooks = Object.values(books);
        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({ message: "Unable to retrieve books", error });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = books[isbn];
        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book", error });
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        const filteredBooks = Object.values(books).filter(b => b.author.toLowerCase() === author);
        return res.status(200).json(filteredBooks);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books", error });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const filteredBooks = Object.values(books).filter(b => b.title.toLowerCase() === title);
        return res.status(200).json(filteredBooks);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books", error });
    }
});

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = books[isbn];
        if (book && book.reviews) {
            return res.status(200).json(book.reviews);
        } else {
            return res.status(404).json({ message: "No reviews found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving reviews", error });
    }
});

module.exports.general = public_users;
