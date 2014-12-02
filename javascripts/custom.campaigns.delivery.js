  $(document).ready(function() {

//		render_timeselect();


		//init
		if($('input[name="campaign_action"]:checked').val()=='schedule')
		{
			$('.withtemplate').show();
		}



	  $('.selectiveradio').on('change', function() {
			//get the id
			var id=$(this).attr('id').split('_');
			
		      $('.selectivetemplate').slideUp();
		      $('#selectivetemplate_'+id[1]).slideDown();

	      var leftHeight = $(".sidebar").height();
	      var rightHeight = $(".wizard .contentleft").height();
	      if (leftHeight > rightHeight){ $(".wizard .contentleft").height(leftHeight)}
	        else{ $(".sidebar").height(rightHeight - 19)};
	  });
	  
	 if($('input[name="schedule_staggerenable"]:checked').val()==1)
	 {
	 	$('#selectivetemplate_1').show();
	 }
	
	
	$('#selective_2').change(function() {
		if(!$(this).is(':checked'))
		{
		 	$('#selectivetemplate_2').show();	
		 	$('#each_batch').hide();					
		}
		else
		{
		 	$('#selectivetemplate_2').hide();	
		 		$('#each_batch').show();		
		}
		  var leftHeight = $(".sidebar").height();
	      var rightHeight = $(".wizard .contentleft").height();
	      if (leftHeight > rightHeight){ $(".wizard .contentleft").height(leftHeight)}
	        else{ $(".sidebar").height(rightHeight - 19)};
	});
	
	 if($('#selective_2:checked').length == 0)
	 {
	 	$('#selectivetemplate_2').show();
	 			 	$('#each_batch').hide();	
	 }

	
	
	
	$('input[name="campaign_action"]').click(function() {
		if($(this).val()=='now')
		{
			$('#what_next').html('Send NOW <i class="icon-play-green"></i>');
		}
		else if($(this).val()=='schedule')
		{
			$('#what_next').html('Schedule <i class="icon-play-green"></i>');		
		}
		else if($(this).val()=='draft')
		{
			$('#what_next').html('Save Campaign <i class="icon-play-green"></i>');				
		}
			
	});

		if($('input[name="campaign_action"]:checked').val()=='now')
		{
			$('#what_next').html('Send NOW <i class="icon-play-green"></i>');
		}
		else if($('input[name="campaign_action"]:checked').val()=='schedule')
		{
			$('#what_next').html('Schedule <i class="icon-play-green"></i>');		
		}
		else if($('input[name="campaign_action"]:checked').val()=='draft')
		{
			$('#what_next').html('Save Campaign <i class="icon-play-green"></i>');				
		}
		



	if($('#schedule_staggerbatches').val() > 255) $('#schedule_staggerbatches').val(255);
	else if($('#schedule_staggerbatches').val() < 1) $('#schedule_staggerbatches').val(1);		

	
	$('.batchsize').html(parseInt(totalrecipients / $('#schedule_staggerbatches').val()));
	create_batches($('#schedule_staggerbatches').val(),parseInt(totalrecipients / $('#schedule_staggerbatches').val()));

	$('.schedule_staggerrecipients').each(function(i, el) {
		$(this).val(schedule_staggerrecipients[i]);		
	});

	//recompute here
	compute_batchsize()	;	

	$('#send_now').bind('click',function(e){ 
	
		var has_error = 0;
	
	
	if($('input[name="campaign_action"]:checked').val() == 'schedule')
	{


		if($('input[name="schedule_staggerenable"]:checked').val()==1)
		{

			has_error = batch_check(has_error);			
			
			has_error = interval_check(has_error);



		if($('input[name="schedule_staggerevenbatch"]').is(':checked') == false)
		{

			$('.staggerrecipients_validation_error').hide();
			$('.schedule_staggerrecipients').each(function(i,el){
				has_error = recipients_check(has_error,el);



			});


			
		
			(function (){	
				$('.staggerrecipientslastbatch_validation_error').hide();

				if(parseInt($('#lastbatchsize').html()) < 1)
				{
					//offset().top 
					$('.staggerrecipientslastbatch_validation_error').find('div').text(' Adjust batches above so this last batch size is greater than 0.');
					$('.staggerrecipientslastbatch_validation_error').show();
					has_error = 1;
					return;

					
				}			
			
			})();
		
		}		
		
		
		
		}		
		
}




		if(has_error ==  1)
		{ 
		  	e.preventDefault();
			return false;		
		}
		else
		{
			//do something ehre
			$('#submit_type').val('next'); 
			save_delivery();
//			$('#delivery_form').submit(); 
			
			
			$('#what_next').html('Please wait... <i class=\'icon-play-green\'></i>'); 
			
			$(this).unbind('click');

		}
				
		
		
//		$(this).attr('onclick','');
	
	
	
	});


	$('#schedule_staggerintervaltype').select2('destroy');
	$('#schedule_staggerintervaltype').selectmenu({style:'dropdown', maxHeight: 170});


	$('.schedule_staggerrecipients').live('change',function() {
		
		var has_error = 0
		has_error = recipients_check(has_error,this);
		compute_batchsize();
		
		(function (){	
					$('.staggerrecipientslastbatch_validation_error').hide();
	
					if(parseInt($('#lastbatchsize').html()) < 1)
					{
						//offset().top 
						$('.staggerrecipientslastbatch_validation_error').find('div').text(' Adjust batches above so this last batch size is greater than 0.');
						$('.staggerrecipientslastbatch_validation_error').show();
						has_error = 1;
						return;
	
						
					}			
				
				})();


		
	});



	//events

	$('#schedule_staggerbatches').change( function() {


		var has_error = 0;
		has_error = batch_check(has_error);
	
		if(has_error)
		{
			maxbatch = totalrecipients;
			if(totalrecipients > 255) maxbatch = 255;
			if($('#schedule_staggerbatches').val() > 255) $('#schedule_staggerbatches').val(255);
			else if($('#schedule_staggerbatches').val() < 1) $('#schedule_staggerbatches').val(1);					
			else if($('#schedule_staggerbatches').val() > totalrecipients) $('#schedule_staggerbatches').val(maxbatch);
			else $('#schedule_staggerbatches').val(maxbatch);



		}
		$('.batchsize').html(parseInt(totalrecipients / $('#schedule_staggerbatches').val()));
		create_batches($(this).val(),parseInt(totalrecipients / $('#schedule_staggerbatches').val()));

	});	
	
	

	$('#schedule_staggerinterval').change( function() {
			
			var has_error = 0;
			has_error = interval_check(has_error);

		if(has_error)
		{
			 if($(this).val() > 255) $(this).val(255);
			 else  $(this).val(1);
		}
	
	});	
	
	
	
	$('#schedule_staggerintervaltype').change( function() {
			

		var has_error = 0;
		has_error = intervaltype_check(has_error);

		if(has_error)
		{
			 if($(this).selectmenu('value') < 1) $(this).selectmenu('value',1);
		}
	
	});	
	
	
	
	

});


function compute_batchsize()
{

	var totalbatchsize = 0;

	$('.schedule_staggerrecipients').each(function(){
		
		totalbatchsize = totalbatchsize + parseInt($(this).val());											
		
	});

	$('#lastbatchsize').html(totalrecipients - totalbatchsize);

	if((totalrecipients - totalbatchsize) < 0  || isNaN(totalrecipients - totalbatchsize) ) 
	{
			$('#lastbatchsize').html('0');
	}
}



function create_batches(howmany, batchsize)
{
	$('#selectivetemplate_2').html('');


	var totalbatchsize = 0;

	//items
	for (var i=0;i < howmany - 1; i++)
	{
		$('#selectivetemplate_2').append('<div class="control-group" style="margin-bottom:0px" >Batch # '+(i+1)+' will reach <input type="text" class="schedule_staggerrecipients" name="schedule_staggerrecipients[]" value="'+batchsize+'" style="width:30px" /> contact(s)<div  class="validate-info validate-error staggerrecipients_validation_error" style="display: none; width:365px; position:relative;"><span class="validation-arrow-up"></span><div></div></div></div>');
		totalbatchsize = totalbatchsize + batchsize;
	}
	
	var lastbatchsize =  totalrecipients - totalbatchsize;	

	//last one
		$('#selectivetemplate_2').append('<div class="control-group schedule_staggerrecipientslastbatch" style="margin-bottom:0px">Batch # '+(i+1)+' will reach <strong id="lastbatchsize">'+lastbatchsize+'</strong> contact(s)<div  class="validate-info validate-error staggerrecipientslastbatch_validation_error" style="display: none; width:430px; position:relative;"><span class="validation-arrow-up"></span><div></div></div></div>');




}




function recipients_check(has_error,el)
{
			var staggerrecipients = $(el).focus().val();
			

			
			//username is required
			if($.trim(staggerrecipients) == '')
			{

				//offset().top 
				$(el).parent('.control-group').find('.staggerrecipients_validation_error').find('div').text(' Number of recipients is required.');
				$(el).parent('.control-group').find('.staggerrecipients_validation_error').show();
				has_error = 1;
				$(el).val(1);
				return has_error;
			}			
		
			if(/^\d+$/g.test(staggerrecipients) == false || staggerrecipients < 1)
			{
				//offset().top 
				$(el).parent('.control-group').find('.staggerrecipients_validation_error').find('div').text(' Please enter a number from 1 or above.');
				$(el).parent('.control-group').find('.staggerrecipients_validation_error').show();
				has_error = 1;

				
				$(el).val(1);


				return has_error;
			}

/*			
			if(staggerrecipients > 255)
			{
				$(this).parent('.control-group').find('.staggerrecipients_validation_error').find('div').text(' Should not be greater than 255.');
				$(this).parent('.control-group').find('.staggerrecipients_validation_error').show();
				has_error = 1;
			return;
			}
*/




	return has_error;


}


function interval_check(has_error)
{

			$('#staggerinterval_validation_error').hide();
			var staggerinterval = $('input[name="schedule_staggerinterval"]').focus().val();
			
			
			//username is required
			if($.trim(staggerinterval) == '')
			{
				//offset().top 
				$('#staggerinterval_validation_error').find('div').text(' Interval is required.');
				$('#staggerinterval_validation_error').show();
				has_error = 1;
				return has_error;
			}

			if(/^\d+$/g.test(staggerinterval) == false || staggerinterval < 1)
			{
				//offset().top 
				$('#staggerinterval_validation_error').find('div').text(' Please enter a number from 1 or above.');
				$('#staggerinterval_validation_error').show();
				has_error = 1;
			return has_error;
			}


			if(staggerinterval > 255)
			{
				$('#staggerinterval_validation_error').find('div').text(' Should not be greater than 255.');
				$('#staggerinterval_validation_error').show();
				has_error = 1;
			return has_error;
			}


			//username is required
			if($.trim($('#schedule_staggerintervaltype').selectmenu('value')) == 0)
			{
				//offset().top 
				$('#staggerinterval_validation_error').find('div').text(' Interval type is required.');
				$('#staggerinterval_validation_error').show();
				has_error = 1;
				return has_error;
			}




		return has_error;

	

}


function intervaltype_check(has_error)
{
		//username is required
	if($.trim($('#schedule_staggerintervaltype').selectmenu('value')) == 0)
	{
		//offset().top 
		$('#staggerinterval_validation_error').find('div').text(' Interval type is required.');
		$('#staggerinterval_validation_error').show();
		has_error = 1;
		return has_error;
	}

	return has_error;

}


function batch_check(has_error)
{

		$('#staggerbatches_validation_error').hide();
		var staggerbatches = $('input[name="schedule_staggerbatches"]').focus().val();
		
		
		//username is required
		if($.trim(staggerbatches) == '')
		{
			//offset().top 
			$('#staggerbatches_validation_error').find('div').text(' Number of batch is required.');
			$('#staggerbatches_validation_error').show();
			has_error = 1;
			return has_error;
		}


		if(/^\d+$/g.test(staggerbatches) == false || staggerbatches < 1)
		{
			//offset().top 
			$('#staggerbatches_validation_error').find('div').text(' Please enter a number from 1 or above.');
			$('#staggerbatches_validation_error').show();
			has_error = 1;
			return has_error;
		}

		
		if(staggerbatches > totalrecipients)
		{
			$('#staggerbatches_validation_error').find('div').text(' Should not be greater than '+ totalrecipients +' .');
			$('#staggerbatches_validation_error').show();
			has_error = 1;
			return has_error;			
		}
	

		if(staggerbatches > 255)
		{
			$('#staggerbatches_validation_error').find('div').text(' Should not be greater than 255 batches.');
			$('#staggerbatches_validation_error').show();
			has_error = 1;
			return has_error;
		}



	return has_error;
}	


	
	


    
    function save_delivery() {

		$.ajax({
			global:false,
			type: 'POST',
			url: '/campaigns/ajax_wizardDelivery/',
			data: $('#delivery_form').serialize(),
			beforeSend: function() {},
			complete: function()  {},
			dataType: 'json',
			cache: false,
			async: false,			
			success: function(data){
	          if (!data.error) {
				setTimeout(function() {}, 5000);
				var ccounter = 1;
 				check_process_status($('#campaign_id').val(), ccounter);

	          } else {
                $('.alert.alert-error').remove();
                prepend_alert = '<div class="alert alert-error">/div>';
                $('body').prepend(prepend_alert);
                $('.alert.alert-error').html('<button class="close" data-dismiss="alert">x</button><i class="icon-exclamation-white"></i>'+data['error']);					
			  }
		    },
			error: function(xhr, textStatus, errorThrown){
				$('#ajax_loading').hide();
				show_top_notification('An unexpected error occurred.', 'error');
			}
		});




    }


	//do some tweaking and waiting here
	function check_process_status(campaign_id, ccounter) {

		var ts = new Date().getTime();
		$('#ajax_loading').show();
	
		$.ajax({
			global:false,
			type: 'GET',
			url: '/campaigns/ajaxcheckstatus_CampaignMessage/'+campaign_id+'/'+ts,
			beforeSend: function() {},
			complete: function()  {},
			dataType: 'json',
			cache: false,
			async: false,			
			success: function(data){
	
				if (typeof(data.message) == 'undefined')
				{
					$('#ajax_loading').hide();
					show_top_notification(data.error);
					window.location.reload(true);
					return;
				}


				if (data.message.substr(0,5) == '(Step')
				{
					show_top_notification(data.message, 'info');

					setTimeout(function(){
						ccounter = ccounter + 1;
						check_process_status(campaign_id, ccounter);
					}, 5000);
				}
				else {
				
					datainput = $.parseJSON(data.message);
				
					//done
			      	if (datainput.status !== '') {
						$.post('/campaigns/ajaxsuccess_wizardDelivery/',{'status': datainput.status , 'error': datainput.error},function() {window.location = data.direct_url;});
			      	} else if (data.success !== '') {
						$.post('/campaigns/ajaxsuccess_wizardDelivery/',{'success': data.success , 'error': datainput.error},function() {window.location = data.direct_url;});
			      	} 			
					
				}

			},
			error: function(xhr, textStatus, errorThrown){
				$('#ajax_loading').hide();
				show_top_notification('An unexpected error occurred.', 'error');
			}
		});

		

		
	
	}
	



