
var fs = require('fs'),
    $ = require('jQuery'),
    _ = require('underscore'),
    EPUBReader;

var PATHS = {
  
  "CONTAINER" : "META-INF/container.xml"
    
};

EPUBReader = function(epubpath) {
    
    var temp,
        identifier;
    
    this.filepath = epubpath + "/";
    
    // Load container file and set root path
    temp = fs.readFileSync(this.filepath + PATHS.CONTAINER, 'utf8');
    this.rootPath = $('rootfile', temp).attr('full-path');
    
    // Load root content file.
    temp = fs.readFileSync(this.filepath + this.rootPath, 'utf8');
    
    this.$content = $(temp);
    this.$metadata = $('metadata', this.$content);
    
    identifier = this.$content.eq(1).attr('unique-identifier');
    
    this.id = $('#' + identifier, this.$content).text();
};

_.extend(EPUBReader.prototype, {
    
    identifier : function() {
        
        return this.$metadata.find("dc\\:identifier").text();
    },
    
    title : function() {
        
        return this.$metadata.find("dc\\:title").text();
    },
    
    rights : function() {
        
        return this.$metadata.find("dc\\:rights").text();
    },
    
    publisher : function() {
        
        return this.$metadata.find("dc\\:publisher").text();
    },
    
    subject : function() {
        
        return this.$metadata.find("dc\\:subject").text();
    },
    
    date : function() {
        
        return this.$metadata.find("dc\\:date").text();
    },
    
    description : function() {
        
        return this.$metadata.find("dc\\:description").text();
    },
    
    creator : function() {
        
        return this.$metadata.find("dc\\:creator").text();
    },
    
    language : function() {
        
        return this.$metadata.find("dc\\:language").text();
    },
    
    cover : function() {
        
        return $('#cover', this.$content).attr('href');
    }
    
});

module.exports = EPUBReader;