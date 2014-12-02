$(document).ready(function() {
	$('#newtemplate .selectiveradio').on('change', function(){

		var id=$(this).attr('id').split('_');
		$('.selectivetemplate').slideUp();
		$('#selectivetemplate_'+id[1]).slideDown();
		var leftHeight = $(".sidebar").height();
	    var rightHeight = $(".contentleft").height();

	    if($('input[name="from"]:checked').val()==2)
		{
			$('#selectivetemplate_1').show();
		}
		else if($('input[name="from"]:checked').val()==3)
		{
			$('#selectivetemplate_2').show();
		}
		else
		{
			$('#selectivetemplate_1').hide();
			$('#selectivetemplate_2').hide();
		}
	});
	
	
	$('#newtemplate .selectiveradio1').on('change', function(){
		var id=$(this).attr('id').split('_');
		$('.selectivetemplate1').slideUp();
		$('#selectivetemplate_'+id[1]).slideDown();

	    var leftHeight = $(".sidebar").height();
	    var rightHeight = $(".contentleft").height();

	    if($('input[name="optout"]:checked').val()==1)
		{
			$('#selectivetemplate_optout').show();
		}
		else
		{
			$('#selectivetemplate_optout').hide();
		}
	});
    

	if($('input[name="optout"]:checked').val()==1)
	{
		$('#selectivetemplate_optout').show();
	}
	else
	{
		$('#selectivetemplate_optout').hide();
	}
    
	if($('input[name="from"]:checked').val()==2)
	{
		$('#selectivetemplate_1').show();
	}
	else if($('input[name="from"]:checked').val()==3)
	{
		$('#selectivetemplate_2').show();
	}
	else
	{
		$('#selectivetemplate_1').hide();
		$('#selectivetemplate_2').hide();
	}

	$('input[name="name"]').focus();
	
});
