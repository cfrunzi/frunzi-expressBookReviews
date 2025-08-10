const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Task 10
// retrieve the book list using Promise callback
const getBookList = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
};

// Get the book list available in the shop
// Task 1
public_users.get('/', async function (req, res) {
  try{
    const books = await getBookList();
    res.json(books);
  } 
  catch(e){
    console.error(e);
    res.status(500).json({message: "Error retrieving the book list"})
  }
  res.send(JSON.stringify(books, null, 2));
});

// Task 11
// retrieve ISBN details based on Promise Callback
const getISBN = () => {
    return new Promise((resolve, reject) => {
        let isbn = parseInt(isbn);

        if(books[isbn]){
            resolve(books[isbn]);
        } else{
            reject({status: 404, message: `ISBN ${isbn} not found`});
        }
    });
};

// Task 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    getISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
});
  
// Task 3
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
