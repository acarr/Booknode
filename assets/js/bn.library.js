
(function(){
    
    $(document).ready(function(){
        
        var $body = $('body'),
            $overlay = $('#bn-drop');
        
        $body.filedrop({
           
           url : 'install',
           paramname : 'book',
           maxfilesize: 50,
           maxfiles: 25,
           
           error : function(err, file) {

              switch(err) {
                case 'BrowserNotSupported':
                    alert('browser does not support html5 drag and drop')
                    break;
                case 'TooManyFiles':
                    
                    console.error("Too many files.");
                    
                    break;
                case 'FileTooLarge':
                    // program encountered a file whose size is greater than 'maxfilesize'
                    // FileTooLarge also has access to the file which was too large
                    // use file.name to reference the filename of the culprit file
                    
                    console.error("File too large.");
                    
                    break;
                case 'FileTypeNotAllowed':
                    
                    console.error("File not allowed");
                    
                default:
                    break;
                } 
               
           },
           
           dragOver : function(event) {
                              
               $overlay.show();                              
           },
           
           dragLeave : function(event) {
               
               $overlay.hide();               
           },
           
           drop : function() {
               
               $overlay.hide();               
           },
           
           uploadStarted : function(i, file, len) {
               
               console.log("started", arguments);
           },
           
           uploadFinished : function(i, file, response, time) {
               
               console.log("finished", arguments);
           },
           
           progressUpdated : function(i, file, progress) {
               
               console.log("progress", arguments);
           },
           
           beforeEach : function(file) {
               
               console.log(file);
           },
           
           beforeSend : function(file, i, done) {
               
               console.log(file, i, done);
               
               done();
           },
           
           afterAll : function() {
               
               console.log("after", arguments);
           }
        });
        
    }); 
    
})();