

//MAIN DOCUMENT READY SECTION
$(function(){


 	//re-render select dropdowns
 	$('select[name="longcode_class"]').select2("destroy");
	$('select[name="longcode_class"]').selectmenu("destroy");	
	$('select[name="longcode_class"]').selectmenu({style:'dropdown', maxHeight: 170});


	//frontend validation
	$('#form_save, #form_saveanother').on('click',function(e){

		
		if($(this).attr('id') == 'form_save')
		{
			$('#submit_type').val('save');
		}
		else
		{
			$('#submit_type').val('save_and_add');		
		}

		var has_error = 0;
	
		//validate	
		(function (){		
			//password
			$('#number_validation_error').hide();
			var longcode_number = $('#number_form input[name="longcode_number"]').focus().val();		

			//password is required
			if($.trim(longcode_number) == '')
			{

				$('#number_validation_error').find('div').text('Number is required.');
				$('#number_validation_error').show();
				has_error = 1;
				return; 
			}
			
			//ajax validation for number
			$.ajax({
				async: false,
				type: "POST",
				url: g_ajax_number_check_url,
				data:{ 
					"what_submit": "number check",
	                "number": longcode_number,
	            },
	            success:function(data) {     
	            	data = JSON.parse(data);       
					if(data.has_error == 2)
					{
						has_error = 1;
						$('#number_validation_error').find('div').text('Number already exists!');
						$('#number_validation_error').show();
					}
					else if(data.has_error == 1)
					{
						$('#number_validation_error').find('div').text('Number is invalid.');
						$('#number_validation_error').show();					
					}
				}
			});			
			
			if(has_error == 1)
			{
				return;
			}

		})();				
	

		//validate	
		(function (){		
			//class
			$('#class_validation_error').hide();
			var longcode_class = $('#number_form select[name="longcode_class"]').val();		

			//is required
			if($.trim(longcode_class) == '')
			{
				$('#class_validation_error').find('div').text('Class is required.');
				$('#class_validation_error').show();
				has_error = 1;
				return; 
			}
		})();				
	
		//validate	
		(function (){		
			//setup
			$('#setup_validation_error').hide();
			var longcode_setup = $('#number_form input[name="longcode_setup"]').focus().val();		

			//is required
			if($.trim(longcode_setup) == '')
			{
				$('#setup_validation_error').find('div').text('Setup cost is required.');
				$('#setup_validation_error').show();
				has_error = 1;
				return; 
			}
			if(/^[0-9]+(\.[0-9]{0,12})?$/g.test(longcode_setup) == false)
			{
	
				$('#setup_validation_error').find('div').text('Setup cost is invalid.');
				$('#setup_validation_error').show();
				has_error = 1;		
				return;
			}				
		})();			


		//validate	
		(function (){		
			//rental
			$('#rental_validation_error').hide();
			var longcode_rental = $('#number_form input[name="longcode_rental"]').focus().val();		

			//is required
			if($.trim(longcode_rental) == '')
			{
				$('#rental_validation_error').find('div').text('Rental cost is required.');
				$('#rental_validation_error').show();
				has_error = 1;
				return; 
			}
			if(/^\d+$/g.test(longcode_rental) == false)
			{
	
				$('#rental_validation_error').find('div').text('Rental cost is invalid.');
				$('#rental_validation_error').show();
				has_error = 1;		
				return;
			}				
		})();			


		if(has_error ==  1)
		{ 
		  	e.preventDefault();
			return false;		
		}
		else
		{
			$('#number_form').submit();
		}

	
	});


});