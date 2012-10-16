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
       
       // Add book to config
       book.open();
       
       config.books[book.id] = book.meta();
       config.save();
       
       response.send("Finished");
    });
});

app.get('/read/:book', function(request, response) {
    
    // Open a book
    
});


app.listen(port);
console.log("Booknode listening on port " + port);







// Click a book



/*

book = new Book(epubFilePath);

console.log("Opening '" + book.filename() + "'");

book.open();

console.log("Opened '" + book.title + "'");
*/

/*
var pages = book.html(),
    html;
    
html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title></title></head><body>';

pages.forEach(function(item, index){
   
   html += '<iframe src="' + item + '"></iframe>';  
});

html += '</body></html>';

fs.writeFile(process.env.BOOKNODE_FOLDER + "/" + book.filename() + ".html", html, function(err){

    if ( err ) {
        
        throw(err);
        return;
    }    
    
    spawn = require('child_process').spawn;
    spawn('open', ["file://" + process.env.BOOKNODE_FOLDER + "/" + book.filename() + ".html"]);
    
});
*/


// Load a page made form our own template. The page has an iframe in it for the actual book


//     spawn = require('child_process').spawn;
//     spawn('open', ['http://www.stackoverflow.com']);
  