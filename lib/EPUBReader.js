
var fs = require('fs'),
    path = require('path'),
    $ = require('jQuery'),
    _ = require('underscore'),
    EPUBReader;

var PATHS = {
  
  "CONTAINER" : "META-INF/container.xml"    
};

EPUBReader = function(epubpath) {
    
    var temp,
        identifier,
        tocPath,
        manifest,
        spline;
    
    this.filepath = epubpath + "/";
    
    // Load container file and set root path
    temp = fs.readFileSync(this.filepath + PATHS.CONTAINER, 'utf8');
    this.rootPath = $('rootfile', temp).attr('full-path');
    
    // Load root content file.
    temp = fs.readFileSync(this.filepath + this.rootPath, 'utf8');
    
    this.dir = path.dirname(this.filepath + this.rootPath);
    this.$content = $(temp);
    this.$metadata = $('metadata', this.$content);
    
    identifier = this.$content.eq(1).attr('unique-identifier');
    
    this.id = $('#' + identifier, this.$content).text();
        
    // Make a hash of all the assets in the content file.
    temp = $('manifest item', this.$content);
    
    manifest = {};
    
    temp.each(function(index, item){
       
       var $item = $(item);
       
       manifest[$item.attr("id")] = this.dir + $item.attr("href");
    });
    
    this.manifest = manifest;
    
    // Parse spline
    temp = $('spine itemref', this.$content);
    spine = [];
        
    temp.each(function(index, item){
      
        spine.push($(item).attr("idref"));
    });
    
    this.spine = spine;
  
    // Load contents file
    tocPath = this.dir + "/" + $('#ncxtoc', this.$content).attr('href');
    temp = fs.readFileSync(tocPath, 'utf8');
    
    this.$contents = $(temp); 
};

// ALL paths should be relative to the book root.

_.extend(EPUBReader.prototype, {

    root : function() {
        
        return this.dir;
    },
    
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
    },
    
    coverImage : function() {
        
        var id = $('meta[name="cover"]', this.$metadata).attr('content');
        return this.asset(id);
    },
    
    // Manifest getter
    
    asset : function(id) {
        
        return this.manifest[id];  
    },
    
    // Spline getter
    
    contents : function() {
        
        return this.spine;  
    },
    
    // Return a JS Object of the TOC hierarchy
    
    toc : function() {
        
        var contents = [],
            navPoints = $('navMap > navPoint', this.$contents);
    
        navPoints.each(function(index, el){
           
            contents.push(objectForNavPoint(el));
        });

        return contents;
    }
    
});


// Private

function objectForNavPoint(navPoint) {
    
    var $nav = $(navPoint),
        $children,
        obj = {
        
        "src" : null,
        "id" : null,
        "title" : "",
        "order" : null,
        "children" : []
    };
    
    obj.id = $nav.attr("id");
    obj.src = $nav.children('content').attr("src");
    obj.title = $nav.children('navLabel').children('text').text();
    obj.order = $nav.attr("playOrder");
    
    $children = $nav.children('navPoint');
    
    if ( $children.length === 0 ) {
        
        return obj;
    }
    
    // Get children
    
    $children.each(function(index, el){
       
        obj.children.push(objectForNavPoint(el));
    });
    
    return obj;
}

module.exports = EPUBReader;

