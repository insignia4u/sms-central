(function($){
  
  var PageBehavior = function(element, options)
  {
    var elem  = $(element);
    var obj   = this;
    
    // Options & Defaults
    
    var o = $.extend({
      header_animation: true,
      footer_animation: true,
      shared_timer_interval: 1500,
      top_threshold: 500,
      bottom_threshold: 100,
      upLink_threshold: 500,
      navbar_threshold: 206
    }, options || {});
    
    // Variables
    
    var sharedTimer, $header, $footer, $body, $window, $document, $upLink, $navbar, $keepScrolling, upLinkInitialBottom;
    
    // Public methods
    // pageBehavior.SetOptions({ top_threshold: 1 })
    
    this.SetOptions = function( settings )
    {
      return this.o = $.extend(o, settings || {});
    };
    
    this.SetFixedHeader = function()
    {
      $header.addClass('fixedHeader');
      obj.SetOptions({ header_animation: false });
    };
    
    this.UnsetFixedHeader = function()
    {
      $header.removeClass('fixedHeader');
      obj.SetOptions({ header_animation: true });
    };

    // Private methods
    
    var init = function()
    {
      $navbar       = $('#navbar') || false;
      $upLink       = $('#up');
      $header       = $('#header');
      $footer       = $('#footer');
      $keepScrolling    = $('#keep-scrolling');
      $body         = $('body');
      $window       = $(window);
      $document     = $(document);      
      upLinkInitialBottom = $upLink.css('bottom');
      
      if ( $navbar && o.navbar_threshold == 0 )
      {
        console.log($navbar.offset().top);
        // o.navbar_threshold = $navbar.offset().top;
        o.navbar_threshold = 5000;
      }
    };
    
    var bindCommonEvents = function()
    {
      $window
        .bind('mousemove', function(e){
          $body.addClass('mousemove');
          pageStatusCheck();
        })
        .bind('scroll', function(e){
          if ( !$body.hasClass('auto-scroll') )
          {
            $body.addClass('scroll');
            scrollPositionCheck();
            pageStatusCheck();

            // $('.fly-from-right').add($('.fly-from-left')).not('.displayed').filter(':onScreen').addClass('displayed');
            $('.fly-in-element').not('.displayed').filter(':onScreen').addClass('displayed');
          }
        })
        .bind('resize', function(e){
          pageStatusCheck();
        });
    };
    
    var bindUpLink = function()
    {
      $upLink.click(function(e){

        var target_location = $window.height() / 4;

        $body.addClass('auto-scroll');

        $upLink.addClass('flying').animate({ bottom: target_location + 'px'}, 500, 'easeInBack', function(){
          $upLink.animate({ bottom: (target_location*4) + 'px', opacity: 0 }, 1000);
        });

        setTimeout(function(){
          $('html, body').animate({ scrollTop:0 }, 500, function(){
            $upLink.removeClass('flying').addClass('hidden');
            setTimeout(function(){
              // $upLink.css({ opacity: 1, bottom: upLinkInitialBottom });
              $upLink.attr('style', '');
              $body.removeClass('auto-scroll');
              scrollPositionCheck();
              pageStatusCheck();
            }, 800)
          });
        }, 600);

        e.preventDefault();
        $upLink.blur();
      });
    };
    
    var pageStatusCheck = function()
    {
      clearInterval(sharedTimer);
      sharedTimer = setInterval(function(){
        $body.removeClass('mousemove').removeClass('scroll');
      }, o.shared_timer_interval);
    }

    var scrollPositionCheck = function()
    {
      var docHeight   = $document.height();
      var winHeight   = $window.height();
      var top     = $window.scrollTop();

      // Header
      
      if ( o.header_animation == true )
      {
        if ( top > o.top_threshold )
          $header.removeClass('displayed');
        else
          $header.addClass('displayed');
      }
      else
      {
        $header.addClass('displayed');
      }

      // Up Link

      if ( top > o.upLink_threshold )
        $upLink.removeClass('hidden');
      else
        $upLink.addClass('hidden');

      // Footer
      /*
      if ( o.footer_animation == true )
      {
        if ( (docHeight-top) > (winHeight+o.bottom_threshold) )
          $footer.removeClass('displayed');
        else
          $footer.addClass('displayed');
      }
      else
      {
        $footer.addClass('displayed');
      }
      */
      
      $footer.addClass('displayed');
      
      // Keep Scrolling
      
      if ( (docHeight-top) > (winHeight+o.bottom_threshold) )
        $keepScrolling.removeClass('pageBottom');
      else
        $keepScrolling.addClass('pageBottom');
      
      // Navbar
      
      if ( $navbar )
      {
        if ( top < o.navbar_threshold )
          $navbar.removeClass('fixedNavbar');
        else
          $navbar.addClass('fixedNavbar');
      }
    }
    
    // Main
    
    init();
    scrollPositionCheck();
    bindCommonEvents();
    bindUpLink();
    
  };

  $.fn.PageBehavior = function(options)
  {
    var element = $(this);
    if ( !element.data('pagebehavior') )
    {
      var pagebehavior = new PageBehavior(this, options);
      element.data('pagebehavior', pagebehavior);
    }
    return element.data('pagebehavior');    
  };
  
})(jQuery);