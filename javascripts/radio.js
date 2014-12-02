$(function () {
	if ($.browser.msie) 
	{
		var inputs = $('.custom-checkbox input');
		inputs.live('change', function()
		{
			var ref = $(this),
				wrapper = ref.parent();
				
			if(ref.is(':checked')) wrapper.addClass('checked');
			else wrapper.removeClass('checked');
		});
		
		inputs.trigger('change');
	}
}); 
