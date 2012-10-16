
var fs = require('fs'),
    zlib = require('zlib'),
    path = require('path'),
    ADMZip = require('adm-zip'),
    _ = require('underscore'),
    $ = require('jQuery'),
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
   
   meta : function() {
       
       var obj = {};
       
       this.open();
       
       obj = {
           
           title : this.reader.title(),
           publisher : this.reader.publisher(),
           creator : this.reader.creator(),
           cover : this.reader.root() + "/" + this.reader.coverImage()
       };
       
       return obj;
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
   
   install : function() {

       if ( !this.unpack() ) {
           
           throw("Unable to unzip epub file.");
           return;
       }
   },
   
   open : function() {
       
       if ( this.reader ) {
           
           return this.reader;
       }
              
       // Create an EPUBReader for parsing
       
       this.reader = new EPUBReader(this.bookpath());

       // To be used to open the browser window later.

       this.id = this.reader.id;
       this.toc = this.reader.toc();
       this.title = this.reader.title();
   }
   
   // Generate a concated HTML document of the book      
   
/*
   html : function() {

       var reader = this.reader,
           root = reader.root(),
           contents = reader.contents(),
           html = [];
                
       contents.forEach(function(item, index){
          
          var asset = reader.asset(item);
              
          html.push(root + "/" + asset);
       });
       
       return html;
   }
*/
    
});

module.exports = Book;