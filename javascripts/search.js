$(function () {

	$("#prependedInput").on('focus', function() 
	{
		$(this).parent().find("span.add-on").addClass("focus")
  });
  
	$("#prependedInput").on('blur', function() 
	{
    $(this).parent().find("span.add-on").removeClass("focus")
  });

}); 
