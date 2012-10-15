/*
 * booknode
 * https://github.com/acarr/booknode
 *
 * Copyright (c) 2012 Alex Carr
 * Licensed under the MIT license.
 */

var fs = require('fs'),
    zlib = require('zlib'),
    path = require('path'),
    Book = require('./Book'),
    epubFilePath,
    book;

process.env.BOOKNODE_FOLDER = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "/.booknode";

// Get file path passed into app.

epubFilePath = process.argv[2];

// Make sure we got something

if ( !epubFilePath ) {
    
    console.warn("Pass in an ePub file path to open a book.");
    return;
}

if ( !fs.existsSync(epubFilePath) ) {
    
    console.log("File not found. Attempted to open " + epubFilePath);
    return;
}

(function(){
 
    // Create the Booknode folder for storing open books if its not already there.
    
    if ( fs.existsSync(process.env.BOOKNODE_FOLDER) ) {
    
        return;
    }
    
    fs.mkdirSync(process.env.BOOKNODE_FOLDER);
    
})();

book = new Book(epubFilePath);

console.log("Opening '" + book.filename() + "'");

book.open();
