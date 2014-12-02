$(function () {
  
	$("#timepicker-slide").on('click', function() 
	{
		var slide = $("#timepicker-slide-button")
		
		if(slide.hasClass('left'))
		{
			slide.removeClass('left')
			slide.addClass('right')
		} 
		else
		{
			slide.removeClass('right')
			slide.addClass('left')
		}
  });

}); 
