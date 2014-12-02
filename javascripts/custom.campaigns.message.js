
function message_charcount(id)
{

	var message= $('#message'+id).val();
	var approx_flag='';	
	var message_count=0;
	
	//adding of approximately
	if(message.search(/(#firstname#|#surname#|#emailaddress#|#dateofbirth#|#mobile#)/)!=-1)
	{
		approx_flag='Approximately';
	}
	else
	{
		approx_flag='';
	}

	//replace
	message=message.replace(/#firstname#/g, '1234567890');
	message=message.replace(/#surname#/g, '1234567890');	
	message=message.replace(/#emailaddress#/g, '1234567890');	
	message=message.replace(/#dateofbirth#/g, '1234567890');			
	message=message.replace(/#mobilenumber#/g, '1234567890');				

	var message_length = message.length;

	//now compute the messages
	if(message_length<=160)	
	{
		message_count=1;
	}
	else {
		message_count=Math.ceil(message_length / 153)
	}
	
	//assign
	$('#message'+id+'_remaining').html(message_length);
	$('#message'+id+'_messages').html(message_count);	
	$('#message'+id+'_approx').html(approx_flag);		
}


    $(document).ready(function() {


		$('.message').unbind('keyup');
		$('#message1').keyup(function(){message_charcount(1)});		
		$('#message2').keyup(function(){message_charcount(2)});		


		$('input[name="saveas"]').change(function() {
			if($(this).is(':checked'))
			{
				$('#contentsaveas').slideDown();
			}
			else
			{
				$('#contentsaveas').slideUp();		
			}
		});
	
			$('input[name="saveas"]').change();	
		
		if($('input[name="from_which"]:checked').val()=='template')
		{
			$('.withtemplate').show();
		}
		else
		{
			$('.withouttemplate').show();
		}
		
		
		$('select[name="template"]').change(function() {
			$('textarea[name="message1"]').val($('select[name="template"] option:selected').data('message'));
		});		
	
		if($('select[name="template"]').val()!='' && $('select[name="template"]').length>0)
		{
			$('.selectswitch').show();
		}
	
	
		//the message counter
		message_charcount(1);
		message_charcount(2);	
		

		$('.tagitem1').click(function() {
			message_charcount(1);
		});

		$('.tagitem2').click(function() {
			message_charcount(2);
		});
		
		
		$('#selectcallback').change(function () { 
     			message_charcount(1);		
      }); 
    });
	
	