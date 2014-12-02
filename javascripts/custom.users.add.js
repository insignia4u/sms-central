function dataFormatResult(data) {
    var markup = "<table class='movie-result'><tr>";
   
    markup += "<td class='data-info'><div class='data-title'>" + data.name + "</div>";
 
    markup += "</td></tr></table>"
    return markup;
}

function dataFormatSelection(data) {
    return data.name;
}


function add_assign_panel(default_string) {
 	var s = $('.assign_panel_template').clone();
 	$('#assign_account_section').append(s);
 	s.removeClass('assign_panel_template');
 	s.addClass('assign_panel');
	
	// do some manipulation of dropdown
	//dropdown set
	

	s.find(".assign_userlevels").each(function() {
		$(this).select2();	
	});


	s.find(".assign_accounts").each(function() {
	
		

		if(g_has_super_access)
		{
			//AJAX for super user search on assign to account dialog
		    $(this).select2({
		        initSelection: function(element, callback) {
		            return $.ajax({
		                url: g_user_all_account_url,
		                dataType: 'json',
		                data: {ids: default_string },
		                success: function(data){
		                    callback(data);
		                }
		            });
		        },
		    	multiple:true,
		    	ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
		    		url: g_user_all_account_url,
		    		data: function (term, page) {
		    			return {
		    				search: term, // search term
		    				limit: 10
		    			};
		    		},
		    		results: function (data, page) { // parse the results into the format expected by Select2.
		    			// since we are using custom formatting functions we do not need to alter remote JSON data
		    			data =  jQuery.parseJSON(data);
		    			return {results: data};
		    		}
		    	},
		    	formatResult: dataFormatResult, // omitted for brevity, see the source of this page
		    	formatSelection: dataFormatSelection, // omitted for brevity, see the source of this page
		    	dropdownCssClass: "bigdrop" // apply css that makes the dropdown taller
		    });
		}
		else
		{

			$(this).select2({
			  data: g_all_account_list,
				multiple:true,
     		  initSelection: function(element, callback) {
		            var data = [];
		            $(default_string.split(",")).each(function (i,val) {
					$.each(g_all_account_list, function(){
                        if(this.id ==  val){
                            data.push({id: this.id, text: this.text });
                        }
                    });
		        });
		        callback(data);
				}
	
		    });

		}


	});	
	

 	s.show();
	return s;
}


//MAIN DOCUMENT READY SECTION
$(function(){

	$('.ui-selectmenu-status').css({'font-weight': 'normal', 'font-size':'12px', 'color':'#666666'});


	//get all the checkbox that are checked
	$('.custom-checkbox input:checked').each(function() {
		 $(this).parent().parent().parent().addClass('selected');
		    $(this).parents('.table-box ').find('#table-footer-2').show();
			$(this).parents('.table-box ').find('#table-footer-1').hide();
	});			


	$('.assign_userlevels').select2("destroy");
	$('.assign_accounts').select2("destroy");	

	
	//create role admin
	if(g_assign_useradmin.length > 0)
	{
		var s = add_assign_panel(g_assign_useradmin.join(','));

	
		s.find("select.assign_userlevels").each(function() {
			$(this).select2('val',1);	
		});


		s.find("input.assign_accounts").each(function() {
			$(this).select2('val',g_assign_useradmin.join(','));	
		});
	}
	

	//create role advanced
	if(g_assign_useradvanced.length > 0)
	{
		var s = add_assign_panel(g_assign_useradvanced.join(','));
		s.find("select.assign_userlevels").each(function() {
			$(this).select2('val',2);	
		});

		s.find("input.assign_accounts").each(function() {
			$(this).select2('val',g_assign_useradvanced.join(','));	
		});
		
	}

	//create role standard
	if(g_assign_userstandard.length > 0)
	{
		var s = add_assign_panel(g_assign_userstandard.join(','));
		s.find("select.assign_userlevels").each(function() {
			$(this).select2('val',3);	
		});

		s.find("input.assign_accounts").each(function() {
			$(this).select2('val',g_assign_userstandard.join(','));	
		});
	}
	
	//remove the role assign panel on clicking remove role link
	$('.assign_panel .remove_role').click(function() {
		$(this).parents('.assign_panel').remove();
	});


	//create a single role on users add, we need to maintain at least one role
	if($('input[name="user_id"]').length == 0 && $('.assign_panel').length == 0)
	{
		var s = add_assign_panel('');
		s.find('.remove_role').remove();
	}


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


		//username
		$('#username_validation_error').hide();
		var username = $('#user_form input[name="username"]').focus().val();

		//username is required
		if($.trim(username) == '')
		{
			//offset().top 
			$('#username_validation_error').find('div').text(' Username is required.');
			$('#username_validation_error').show();
			has_error = 1;

		}
		//username has invalid char
		if(/^[a-zA-Z0-9_@.-]+$/g.test(username) == false)
		{

			$('#username_validation_error').find('div').text('Username has invalid characters.');
			$('#username_validation_error').show();
			has_error = 1;		
		}
		
		//password
		$('#password_validation_error').hide();
		var password = $('#user_form input[name="password"]').focus().val();		
		var cpassword = $('#user_form input[name="cpassword"]').focus().val();	
		
		//add
		if($('input[name="user_id"]').length == 0)
		{
			//password is required
			if($.trim(password) == '')
			{

				$('#password_validation_error').find('div').text('Password is required.');
				$('#password_validation_error').show();
				has_error = 1;
			}
		}
		//invalid password
		if(password.indexOf(" ") != -1)
		{
			$('#password_validation_error').find('div').text('Invalid password.');
			$('#password_validation_error').show();
			has_error = 1;
		}
		//mismatched
		if(password != cpassword)
		{
			$('#password_validation_error').find('div').text('Password mismatched!');
			$('#password_validation_error').show();
			has_error = 1;
		}
		

		//firstname
		$('#firstname_validation_error').hide();
		var firstname = $('#user_form input[name="firstname"]').focus().val();					

		//required		
		if($.trim(firstname) == '')
		{

			$('#firstname_validation_error').find('div').text('First Name is required.');
			$('#firstname_validation_error').show();
			has_error = 1;
		}



		//lastname
		$('#surname_validation_error').hide();
		var surname = $('#user_form input[name="surname"]').focus().val();					

		//required		
		if($.trim(surname) == '')
		{

			$('#surname_validation_error').find('div').text('Last Name is required.');
			$('#surname_validation_error').show();
			has_error = 1;
		}
		



		//email
		$('#emailaddress_validation_error').hide();
		var emailaddress = $('#user_form input[name="emailaddress"]').focus().val();					

		//required		
		if($.trim(emailaddress) == '')
		{

			$('#emailaddress_validation_error').find('div').text('Emailaddress is required.');
			$('#emailaddress_validation_error').show();
			has_error = 1;
		}
		
		//invalid
		if(/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/ig.test(emailaddress) == false)
		{

			$('#emailaddress_validation_error').find('div').text('Email Address is invalid.');
			$('#emailaddress_validation_error').show();
			has_error = 1;			
		}

				
		//mobilenumber
		$('#mobilenumber_validation_error').hide();
		var mobilenumber = $('#user_form input[name="mobilenumber"]').focus().val();					
		

		//required		
		if($.trim(mobilenumber) == '')
		{

			$('#mobilenumber_validation_error').find('div').text('Mobile number is required.');
			$('#mobilenumber_validation_error').show();
			has_error = 1;
		}		

		//number only
		if(/^\d+$/g.test(mobilenumber) == false)
		{

			$('#mobilenumber_validation_error').find('div').text('Mobile number is invalid.');
			$('#mobilenumber_validation_error').show();
			has_error = 1;		
		}		

		
		//lets now proceed to each role and assign account
		$('.assign_panel').each(function(i,el) {
			$(el).find('.assign_userlevels').each(function(j,aul) {
				$(el).find('.role_validation_error').hide();
				if($(aul).select2('val') == '')
				{
					$(el).find('.role_validation_error').find('div').text('Role is required.');
					$(el).find('.role_validation_error').show();
					has_error = 1;
				}
			});


			$(el).find('.assign_accounts').each(function(j,aa) {
				$(el).find('.assign_account_validation_error').hide();
				if($(aa).select2('val') == '')
				{
					$(el).find('.assign_account_validation_error').find('div').text('At least one account is required.');
					$(el).find('.assign_account_validation_error').show();
				has_error = 1;
				}
			});
		
		});
		
		if(has_error ==  1)
		{ 
		  	e.preventDefault();
			return false;		
		}
		else
		{
			$('#user_form').submit();
		}
		
		
			
	});
			
});
	

	

