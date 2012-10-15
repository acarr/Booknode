
var fs = require('fs'),
    zlib = require('zlib'),
    path = require('path'),
    ADMZip = require('adm-zip'),
    _ = require('underscore'),
    Book;


Book = function(filepath) {
    
    this.filepath = filepath;
};

_.extend(Book.prototype, {
   
   filename : function() {
       
       return path.basename(this.filepath);
   },
   
   // Unzip the book to the Booknode Folder
   
   unpack : function() {
       
       var zip,
           entries;
       
       zip = new ADMZip(this.filepath);
       zip.extractAllTo(process.env.BOOKNODE_FOLDER + "/" + this.filename(), true);
   },
   
   open : function() {
       
       this.unpack();
       
       console.log(process.env.BOOKNODE_FOLDER);
   }
    
});


module.exports = Book;