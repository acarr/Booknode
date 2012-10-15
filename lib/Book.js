
var fs = require('fs'),
    zlib = require('zlib'),
    path = require('path'),
    ADMZip = require('adm-zip'),
    _ = require('underscore'),
    EPUBReader = require('./EPUBReader'),
    Book;


Book = function(filepath) {
    
    this.filepath = filepath;
};

_.extend(Book.prototype, {
   
   filename : function() {
       
       return path.basename(this.filepath);
   },
   
   bookpath : function() {
       
       return process.env.BOOKNODE_FOLDER + "/" + this.filename();
   },
   
   // Unzip the book to the Booknode Folder
   
   unpack : function() {
       
       var zip,
           entries;
       
       zip = new ADMZip(this.filepath);
       zip.extractAllTo(this.bookpath(), true);
   
       // Add error handling here
   
       return true;
   },
   
   open : function() {
       
       if ( !this.unpack() ) {
           
           throw("Unable to unzip epub file.");
           return;
       }
       
       // Create an EPUBReader for parsing
       
       this.reader = new EPUBReader(this.bookpath());

   }
    
});


module.exports = Book;