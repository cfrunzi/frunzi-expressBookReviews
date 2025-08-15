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
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (authenticatedUser(username, password)){
        // allow 30 minute session for authentication
        let bearerToken = jwt.sign({data:password}, "access", {"expiresIn": 1800});
        req.session.authentication = {bearerToken, username};
        return res.status(200).json({message: "User successfully logged in"});
    } else {
        return res.status(401).json({message: "Invalid username or password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
