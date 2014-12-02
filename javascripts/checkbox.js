$(function () {
	if ($.browser.msie) 
	{
		$(document).ready(function() {
        $(':radio').click(function() {           
            $(this).closest('.custom-radio').siblings().removeClass("checked").end()
                $(this).closest('.custom-radio').addClass("checked"); //a click always makes a radio button true, so no need to check
        });
        $('.custom-radio input:checked').parent().addClass("checked");
    });
	}
});