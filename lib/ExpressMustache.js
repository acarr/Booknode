
var fs = require('fs'),
	p = require('path'),
	_ = require('underscore'),
	Mustache = require('mustache'),
	cache = {};

function read(path, options, fn) {
	
	var str = cache[path];

	// Cached (only if cached is a string and not a compiled template function)
	if (options.cache && str && typeof str === 'string') return fn(null, str);

	// Read
	fs.readFile(path, 'utf8', function(err, str){
			
		if (err) return fn(err);
		if (options.cache) cache[path] = str;
		
		fn(null, str);
	});
};

module.exports = function(path, options, fn) {

	var partials = p.dirname(path) + "/partials/";

	if ( this.engine.globals ) {
		
		options = _.extend({}, this.engine.globals, options);
	}

	read(path, options, function(err, str){

		if (err) return fn(err);

		try {

			options.filename = path;

			fn(null, Mustache.render(str, options, function(name){
				
				return fs.readFileSync(partials + name + ".mustache", "utf8");
			}));

		} catch (err) {
			
			fn(err);
		}
	});
};






