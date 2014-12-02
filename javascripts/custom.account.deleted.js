$(function(){
	$(".expand-collapse").unbind('click');
	$(".expand-collapse-alt").unbind('click');

	
	
	$("#search_form").submit(function () {
		if($('#btn_filter').is(":disabled"))
		{
			return false;
		}
 	});
 	    	
});


