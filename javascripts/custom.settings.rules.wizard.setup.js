function sidebar_fix()
{

	$(".wizard .contentleft").css('height','auto');
	$(".sidebar").css('height','auto');
	
	
     var leftHeight = $(".sidebar").height();
      var rightHeight = $(".wizard .contentleft").height();
      if (leftHeight > rightHeight){ $(".wizard .contentleft").height(leftHeight)}
      else{ $(".sidebar").height(rightHeight - 24)};
}  

$(document).ready(function() {
$('input[name="when"]').change(function() {
	if($('input[name="when"]:checked').val()=='sending')
	{
		$('#tofrom').html('Sending From');
	}
	else
	{
		$('#tofrom').html('Receiving To');
	}
});

$('input[name="when"]').change();


	sidebar_fix();
});