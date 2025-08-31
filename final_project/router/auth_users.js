const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Task 7
const isValid = (username)=>{ 
    // returns boolean
    // confirm user already exists 
    return users.some(user => user.username === username);
}

// only allow registered users to login
const authenticatedUser = (username,password)=>{ 
    //returns boolean
    return users.some(user => user.username === username && user.password === password);

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;

    // first confirm if attempt does not have username/password
    if (!username || !password){
        return res.status(400).json({ message: "Username and password required"});
    }

    if (authenticatedUser(username, password)){
        let accessToken = jwt.sign({username}, "access", {expiresIn: 3600});

        // save to session
        req.session.authorization = {accessToken, username};
        return res.status(200).json({message: "User successfully logged in"});
    } else {
        return res.status(403).json({message: "Invalid username or password"});
    }

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
    if (books[isbnNumber]){
        books[isbnNumber].reviews[username] = bookReview;
        return res.status(200).send({"message": "Review successfully posted/updated"});
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


    if (books[isbnNumber] && books[isbnNumber].reviews && books[isbnNumber].reviews[username]){
        delete books[isbnNumber].reviews[username];
        return res.status(200).send("Review successfully deleted");
    } else {
        return res.status(404).send({"message": `ISBN ${isbnNumber} not found`});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
