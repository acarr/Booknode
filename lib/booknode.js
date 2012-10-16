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
    
    Configure = require('./Configure'),
    Book = require('./Book'),
    tmpl = require('../lib/ExpressMustache'),
    
    app,
    config;

process.env.BOOKNODE_FOLDER = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "/.booknode";

(function(){
 
    // Create the Booknode folder for storing open books if its not already there.
    
    if ( fs.existsSync(process.env.BOOKNODE_FOLDER) ) {
    
        return;
    }
    
    fs.mkdirSync(process.env.BOOKNODE_FOLDER);
    fs.mkdirSync(process.env.BOOKNODE_FOLDER + "/tmp");
    
})();


// Setup config

config = new Configure(process.env.BOOKNODE_FOLDER + "/booknode.json");
config.defaults({
   
   books : [] 
    
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
    	
    	books : config.books,
    	hasBooks : (config.books.length > 0)
    	
	});
	
	return;
});

app.post('/install', function(request, response){
    
    // Install a book
    
    var name,
        file,
        bytesUploaded = 0,
        fileCount = 0;
        
    name = request.files.book.name;
      
    file = fs.createWriteStream(process.env.BOOKNODE_FOLDER + "/tmp/" + name, {
       
       flags : 'w',
       encoding : 'binary',
       mode : '0777' 
    });
   
    request.on('data', function(chunk) {
       
       file.write(chunk)
    });
   
    request.on('error', function(err) {
        
       console.error(err);
       response.send("ERROR");
    });
    
    request.on('end', function() {
       
       console.log("Finished");
       
       file.end();
       response.send("TEST"); 
    });
    
    request.on('close', function() {
        
        console.log("Finished");
       
       file.end();
       response.send("TEST"); 
    });

});

app.get('/read/:book', function(request, response) {
    
    // Open a book
    
});


app.listen(3000);
console.log("Booknode listening on port 3000");







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
  