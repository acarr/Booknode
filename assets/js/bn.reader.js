
$(document).ready(function(){
        
    var $reader = $('#reader');
    
    bn.resizeFrame = function() {
        
        var height = 0;
            
        height = $reader.get(0).contentWindow.document.body.scrollHeight;
        $reader.height(height);
    };
    
    $reader.load(bn.resizeFrame);
    bn.resizeFrame();

}); 
