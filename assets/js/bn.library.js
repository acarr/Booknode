
(function(){
    
    $(document).ready(function(){
        
        var $body = $('body'),
            $container = $('#bn-container'),
            $uploading = $('#bn-progress'),
            $progress = $('progress', $uploading);
        
        $container.filedrop({
           
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
                
                $container.addClass("drop");                              
           },
           
           dragLeave : function(event) {
               
               $container.removeClass("drop");  
           },
           
           drop : function() {
               
               $container.removeClass("drop");                
           },
           
           beforeEach : function(file) {
               
               // Update progress filename
               $('span', $uploading).text(file.name);
               $progress.removeAttr('value');
               
               $container.addClass("uploading");
               console.log("beforeEach", arguments);
           },
           
           beforeSend : function(file, i, done) {
               
               console.log("beforeSend", arguments);
               done();
           },
           
           uploadStarted : function(i, file, len) {
               
               $progress.val(0);
               console.log("started", arguments);
           },
  
           progressUpdated : function(i, file, progress) {
               
               $progress.val(progress);
               console.log("progress", arguments);
           },
  
           uploadFinished : function(i, file, response, time) {
               
               console.log("finished", arguments);
           },
           
           afterAll : function() {
               
               $container.removeClass("uploading");
               $progress.removeAttr('value');
               console.log("after", arguments);
           }
        });
        
    }); 
    
})();