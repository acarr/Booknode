/*
 * booknode
 * https://github.com/acarr/booknode
 *
 * Copyright (c) 2012 Alex Carr
 * Licensed under the MIT license.
 */

var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    _ = require('underscore'),
    
    Configure = require('./Configure'),
    Book = require('./Book'),
    tmpl = require('../lib/ExpressMustache'),
    
    port = 3030,
    app,
    config;

process.env.BOOKNODE_FOLDER = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "/.booknode";

(function(){
 
    // Create the Booknode folder for storing open books if its not already there.
    
    if ( !fs.existsSync(process.env.BOOKNODE_FOLDER) ) {
    
        fs.mkdirSync(process.env.BOOKNODE_FOLDER);
    }
    
    if ( !fs.existsSync(process.env.BOOKNODE_FOLDER + "/tmp") ) {
        
        fs.mkdirSync(process.env.BOOKNODE_FOLDER + "/tmp");
    }

})();


// Setup config

config = new Configure(process.env.BOOKNODE_FOLDER + "/booknode.json");
config.defaults({
   
   books : {}
    
});


// Setup express app

app = express();
app.set('view engine', 'mustache');
app.set('views', __dirname + "/templates");
app.engine(".mustache", tmpl);
app.use('/assets', express.static(__dirname + '/../assets'));
app.use('/books', express.static(process.env.BOOKNODE_FOLDER));
app.use(express.bodyParser());
app.use(express.cookieParser());


// Load a start page which lists all the installed books and
// has a place to open a new book (file browse or drag)

app.get('/', function(request, response) {
	
	response.render('library', {
    	
    	books : _.toArray(config.books)
    	
	});
	
	return;
});

app.post('/install', function(request, response){
    
    // Install a book
    
    var name,
        target,
        tamp;
    
    name = request.files.book.name;
    temp = request.files.book.path;
    target = process.env.BOOKNODE_FOLDER + "/tmp/" + name;
    
    console.log("Uploading file '" + name + "' to '" + target + "'");
    
    fs.rename(temp, target, function(err){
       
       var book;
       
       if (err) {
           
           console.error(err);
           response.send(err);
           return;
       }
       
       console.log("'" + name + "' uploaded.");
       
       // Install book
       book = new Book(target);
       book.install();
       
       console.log("Installing...");
       
       // Add book to config
       book.open();
       
       console.log("'" + book.title + "' installed.");
       
       config.books[book.id] = book.meta();
       config.save();
       
       response.send("Finished");
    });
});

app.get('/read/:book', function(request, response) {
    
    var filename,
        target,
        book;
    
    filename = request.params.book;
    
    console.log("Attempting to read book '" + filename + "'");
    
    // Try to find the book.
    target = process.env.BOOKNODE_FOLDER + "/" + filename;
    
    if ( !fs.existsSync(target) ) {
    
        throw("Book not found at '" + target + "'");
        return;
    }
    
    book = new Book(target); 
    book.open();
           
    response.render('reader', {
    	
    	book : config.books[book.id],
    	toc : htmlForTOC(book.toc),
    	pos : "/books/" + book.toc[0].src
    	
	});
});


app.listen(port);
console.log("Booknode listening on port " + port);


// Private Helpers

function htmlForTOC(toc) {
    
    var html = "<ul>";
    
    toc.forEach(function(item, index){
       
       html += '<li><a href="/books/' + item.src + '" target="reader">' + item.title + '</a>';
       
       if ( item.children.length > 0 ) {
           
           html += htmlForTOC(item.children);
       }
        
       html += '</li>';
        
    });
    
    html += "</ul>";
    
    return html;
};

  