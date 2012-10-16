
var fs = require('fs'),
    zlib = require('zlib'),
    path = require('path'),
    ADMZip = require('adm-zip'),
    _ = require('underscore'),
    EPUBReader = require('./EPUBReader'),
    Book;


Book = function(filepath) {
    
    if ( !filepath ) {
        
        throw("The path to the .epub file is required to create a new Book.");
        return;
    }
    
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
       
       // See if the book already exists...
       if ( fs.existsSync(this.bookpath()) ) {
        
            return true;
       }
       
       zip = new ADMZip(this.filepath);
       zip.extractAllTo(this.bookpath(), true);
   
       // TODO: Add error handling here
   
       return true;
   },
   
   open : function() {
       
       var spawn;
       
       if ( !this.unpack() ) {
           
           throw("Unable to unzip epub file.");
           return;
       }
       
       // Create an EPUBReader for parsing
       
       this.reader = new EPUBReader(this.bookpath());

       // To be used to open the browser window later.

//     spawn = require('child_process').spawn;
//     spawn('open', ['http://www.stackoverflow.com']);
  
  
        console.log(this.reader.contents());
   }
    
});


module.exports = Book;