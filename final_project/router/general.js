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
const getISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        let parsedISBN = parseInt(isbn);

        if(books[parsedISBN]){
            resolve(books[parsedISBN]);
        } else{
            reject({status: 404, message: `ISBN ${parsedISBN} not found`});
        }
    });
};

// Task 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    getISBN(req.params.isbn)
    .then(book => {
        res.send(JSON.stringify(book, null, 2));
    })
    .catch(err => {
        res.status(err.status || 500).json({error: err.message || "Internal Server Error"});
    });
});
  
// Task 3 + 12
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const bookAuthor = req.params.author;
    getBookList()
    .then((bookEntries) => Object.values(bookEntries))
    .then((bookList) => bookList.filter((book) => book.author === bookAuthor))
    .then((filterBookList) => res.send(filterBookList));

});

// Task 4 + 13
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const bookTitle = req.params.title;
    getBookList()
    .then((bookEntry) => Object.values(bookEntry))
    .then((bookList) => bookList.filter((book) => book.title === bookTitle))
    .then((filteredList) => res.send(filteredList));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
