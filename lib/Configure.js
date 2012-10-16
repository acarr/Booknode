

var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    Configure;


Configure = function(configPath) {
    
    this._path = function() {
        
        return configPath;
    };
    
    if ( !fs.existsSync(configPath) ) {
        
        this.save();
    }
    
    this.revert();
};

_.extend(Configure.prototype, {
   
   defaults : function(obj) {
       
       obj = _.extend(obj, this);
       _.extend(this, obj);
   },
   
   save : function() {
       
       fs.writeFileSync(this._path(), JSON.stringify(this));
   },
   
   revert : function() {
       
       var config = fs.readFileSync(this._path(), 'utf8');
       _.extend(this, JSON.parse(config));
   }
    
});

module.exports = Configure;

