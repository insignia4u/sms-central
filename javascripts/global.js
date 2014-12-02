jQuery(document).ready(function($){
  
  pageBehavior = $(document).PageBehavior();
  
  // Helpers
  
  $('body').not('.template-homepage').find('#content').css({ 'padding-top': $('#header').height()+30 });
    
  // Click to Call
  
  function handle_ctc()
  {
    var animationTime = 200;
    if ( ctc_is_open )
    {
      ctc_is_open = false;
      ctc_open.animate({ bottom: 0 }, animationTime, 'easeInOutQuad');
      setTimeout(function(){
        ctc_closed.animate({ bottom: -ctc_closed.height() }, animationTime, 'easeInOutQuad' );
      }, animationTime)
    }
    else
    {
      ctc_is_open = true;
      ctc_closed.animate({ bottom: 0 }, animationTime, 'easeInOutQuad' );
      setTimeout(function(){
        ctc_open.animate({ bottom: -ctc_open.height() }, animationTime, 'easeInOutQuad' );
      }, animationTime)
    }
  }
  
  var ctc_closed  = $('#click-to-call');
  var ctc_open  = $('#click-to-call-open');
  var ctc_is_open = true;
  
  ctc_closed.click(function(e){
    handle_ctc();
    e.preventDefault();
  });
  
  ctc_open.click(function(e){
    handle_ctc();
    e.preventDefault();
  });
  
  ctc_open.trigger('click');
});