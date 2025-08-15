const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Task 7
const isValid = (username)=>{ 
    // returns boolean
    // confirm user already exists 
    const userMatch = users.filter((user) => user.username === username);
    return userMatch.length > 0;
}

// only allow registered users to login
const authenticatedUser = (username,password)=>{ 
    //returns boolean
    const existingUsers = users.filter((user) => user.username === username && user.password === password);
    return existingUsers.length > 0;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;

    // first check if the username exists first
    if (!isValid(username)){
        return res.status(401).json({"message": "User does not exist, please register first"});
    }

    // if username exists, check if username and password match
    if(!authenticatedUser(username, password)){
        return res.status(403).json({"message": "Invalid username or password"});
    }

    // generate JWT bearer token
    const bearerToken = jwt.sign({data: password}, "access", {"expiresIn": 3600});
    // store in session under authorization
    req.session.authorization = {bearerToken, username};
    return res.status(200).json({"message": "User successfully logged in"});

});

// Task 8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbnNumber = req.params.isbn;

    const bookReview = req.body.review;
    const username = req.session.authorization?.username;

    // first confirm a user is logged in
    if (!username){
        return res.status(403).json({"message": "You must be logged in to post a review"});
    }

    // check if ISBN number exists in the book list and update review, otherwise return 404
    if (books[isbn]){
        let book = books[isbnNumber];
        book.reviews[username] = bookReview;
        return res.status(200).send({"message": "Review successfully posted"});
    } else {
        return res.status(404).send({"message": `ISBN ${isbnNumber} not found`});
    }

});

// Task 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbnNumber = req.params.isbn;
    const username = req.session.authorization?.username;

    // first confirm a user is logged in
    if (!username){
        return res.status(403).json({"message": "You must be logged in to delete a review"});
    }


    if (books[isbnNumber]){
        let book = books[isbnNumber];
        delete book.reviews[username];
        return res.status(200).send("Review successfully deleted");
    } else {
        return res.status(404).send({"message": `ISBN ${isbnNumber} not found`});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
