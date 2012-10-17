
$(document).ready(function(){
        
    var $reader = $('#reader');
    
    bn.resizeFrame = function() {
        
        var height = 0;
            
        height = $reader.get(0).contentWindow.document.body.scrollHeight;
        $reader.height(height);
    };
    
    bn.resizeImages = function() {
        
        var $head = $reader.contents().find("head");
        $head.append('<style type="text/css"> img { max-width: 100%; } </style>');
    };
    
    $reader.load(bn.resizeFrame);
    $reader.load(bn.resizeImages);
    bn.resizeFrame();
}); 
