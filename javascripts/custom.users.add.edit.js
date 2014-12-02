//NO SELECTED DIALOG CALL
function confirm_noselected(alt_message, alt_title) {
	$('#confirm2 .modal-body').html(alt_message);
	$('#confirm2 #myModalLabel').html(alt_title);
    $('#confirm2').modal();

}


//DELETE DIALOG CALL
function confirm_delete(alt_message){
	$('#confirm1 .modal-body p').html(alt_message);
    $('#confirm1').modal();
 }


//format dropdown
function dataFormatResult(data) {
	
   
    var markup = "<table class='movie-result'><tr>";
   
    markup += "<td class='data-info'><div class='data-title'>" + data.name + "</div>";
 
    markup += "</td></tr></table>"
    return markup;
}

//format dropdown selection
function dataFormatSelection(data) {

    return data.name;
}

//clone the panel
function add_assign_panel() {

	//defaults
	var exist_levels = [];
	$('.assign_panel').each(function(){

		exist_levels.push($(this).find('select.assign_userlevels').selectmenu('value'));
	});
	
	var default_level =  1;
	for(var i = 1; i <= 3 ; i++)
	{
		if($.inArray( i, exist_levels) == -1)
		{
			default_level = i;
			break;
		}
	}


	//clone the panel
 	var s = $('.assign_panel_template').clone();
 	$('#assign_account_section').append(s);
 	s.removeClass('assign_panel_template');
 	s.addClass('assign_panel');
	
	// do some manipulations on dropdown, convert to select2
	s.find(".assign_userlevels").each(function() {
		//$(this).select2();	
		$(this).selectmenu({style:'dropdown', maxHeight: 170});
		$(this).selectmenu('value', default_level);
	});



	//do some manipulations on  assign accounts
	s.find(".assign_accounts").each(function() {
	
		//if it has super access search all account in server
		if(g_has_super_access)
		{
			//AJAX for super user search on assign to account dialog
		    $(this).select2({
		        initSelection: function(element, callback) {
					
		            return $.ajax({
		                url: g_user_all_account_url,
		                dataType: 'json',
		                data: {ids: element.val() },
		                success: function(data){
		                    callback(data.items);
		                }
		            });
		        },
		    	multiple:true,
		    	ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
		    		url: g_user_all_account_url,
		    		data: function (term, page) {
		    			return {
		    				search: term, // search term
		    				limit: 10,
		    				page: page
		    			};
		    		},
		    		results: function (data, page) { // parse the results into the format expected by Select2.
		    			// since we are using custom formatting functions we do not need to alter remote JSON data
		    
		    			data =  jQuery.parseJSON(data);
		    			
						var arr=[];
						$('.assign_panel input.assign_accounts').each(function() {
							arr = $.merge(arr,$(this).select2('val'));
						});
						
						data.items = $.grep(data.items, function(val) {
							if($.inArray(val.id, arr) == -1) 
							{
								return true;
							}
							else
							{
								return false;
							}
						});						
						
				        var more = (page * 10) < data.total;

		    			return {results: data.items, more: more};
		    		}
		    	},
		    	formatResult: dataFormatResult, // omitted for brevity, see the source of this page
		    	formatSelection: dataFormatSelection, // omitted for brevity, see the source of this page
		    	dropdownCssClass: "bigdrop" // apply css that makes the dropdown taller
		    });
		}
		else
		{
			//search account in html 
			$(this).select2({
			  data: g_all_account_list,
				multiple:true,
     		  initSelection: function(element, callback) {
		            var data = [];
		            $.each(element.val().split(","),function (i,val) {
					$.each(g_all_account_list, function(){
                        if(this.id ==  val){
                            data.push({id: this.id, text: this.text });
                        }
                    });
		        });
		        callback(data);
				},
			  query: function (query) {
					var data = {results: []};
					var arr=[];
					$('.assign_panel input.assign_accounts').each(function() {
						arr = $.merge(arr,$(this).select2('val'));
					});
				

				$.each(g_all_account_list, function(){
					 if(query.term.length == 0 || this.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 ){
						data.results.push({id: this.id, text: this.text });
					}
                });


				data.results = $.grep(data.results, function(val) {
			
						if($.inArray(String(val.id), arr) == -1) 
						{

							return true;
						}
						else
						{
							return false;
						}
					});


				query.callback(data);
				}
			});

		}


	});	
	
	//return cloned panel
 	s.show();

	//count how panel existing
	if($('.assign_panel').length >= 3)
	{
		$('#add_assign_panel').hide();
	}

	if($('.assign_panel').length >= 2)
	{
		$('.assign_panel .remove_role').show();		
	}
	return s;
}

//show the footer or hide the footer on the table
function table_footer_showhide(parent){
	count_checked_numbers = parent.find('table .custom-checkbox input[type="checkbox"]:checked').length;
    if (count_checked_numbers > 0){
        parent.find('.table-footer-2').show();
        parent.find('.table-footer-1').hide();

        parent.find('table .custom-checkbox input[type="checkbox"]:checked').each(function(){
        	$(this).parent().parent().parent().addClass('selected');
        })
    }else{
        parent.find('.table-footer-1').show();
        parent.find('.table-footer-2').hide();
    }
}



function create_table_result(data,parent){

	html = '';
	htmlhead = '';
	
	//generate table head
	htmlhead += '<tr>';
	htmlhead += '<th colspan="1" class="first"><a href="'+data.base_url+'/name/'+data.sort_by_name+'/'+data.limit+'/'+data.offset+'">Account Name</a></th>';
	htmlhead += '<th colspan="1"><a href="'+data.base_url+'/parentname/'+data.sort_by_parentname+'/'+data.limit+'/'+data.offset+'">Parent Account</a></th>';
	htmlhead += '<th colspan="1"></th>';
	htmlhead += '<th class="last" colspan="1"></th>';
	htmlhead += '</tr>';
	parent.find('#table-1.accountlist table thead').html(htmlhead);
	parent.find('#table-1.accountlist table thead a').click(function(e){
		resend_url(this.href, parent);
		e.preventDefault();
	});

	//generate html select page
	htmlselectpage = '';
	htmlselectpage += '';
	
	pages = [5,10,20,50,100];
	$.each(pages, function(index,value){
		add_selected = '';
		if (data.limit == value)
			add_selected = ' selected="selected" ';
		htmlselectpage += '<option '+add_selected+' value="'+data.base_url+'/'+data.sort_by+'/'+data.sort_order+'/'+value+'">'+value+' / page</option>';
	});
	//destroy the select2 so we can re-initialize it again
	parent.find('select.selectpage_account').selectmenu('destroy');
	parent.find('select.selectpage_account').select2('destroy');

	//add html
	parent.find('#table-1.accountlist .selectpage ul select').html(htmlselectpage);
	parent.find('select.selectpage_account').select2();

	//checkboxes
	add_checked = '';
	if (data.accounts != undefined){
		c = 1;
		$.each(data.accounts, function(index, account) {
		
		  var id_exist = false;	
		 
		  $('.assign_panel').each(function(i,ap) {
		  
			if($(ap).find('input.assign_accounts').select2('val').toString() != parent.find('input.assign_accounts').select2('val').toString())
			{		  
			  	if($.inArray(String(account.id) , $(ap).find('input.assign_accounts').select2('val')) > -1)
			  	{
			  		id_exist = true;
			  		return;
			  	}
		  	}
		  }); 
		  
         if(id_exist == false)
         {
		
			html += '<tr class="item-'+c+' item">';
			html += '<td>'+account.name+'</td>';
			html += '<td>'+account.parentname+'</td>';
			
			add_checked = '';
			$.each(data.selected_accounts, function(index, selected_account) {
				if (account.id == selected_account){
					add_checked = ' checked="checked" ';
					return;
				}
			});
			
			html += '<td><span class="custom-checkbox"><input type="checkbox" '+add_checked+' class="checkbox-'+c+'" value="'+account.id+'"><span class="box"><span class="tick"></span></span></span></td><td class="last"></td>';
			html += '</tr>';
			
			c++;
		   }
		
		});
	}
	parent.find('#table-1.accountlist table tbody').html(html);

	//generate pagination
	parent.find('#table-1.accountlist .pager .pagination').html(data.pagination);

	offset_desc = parseInt(data.offset) + 1;
	limit_desc = parseInt(data.limit) + parseInt(data.offset);
	showing_results_txt = 'Showing results '+offset_desc+' - '+limit_desc+' of '+data.total_count;
	parent.find('#table-1.accountlist .footer .showresult').html(showing_results_txt);

	//reload url on select page change
	parent.find('select.selectpage_account').unbind('change');
	parent.find('select.selectpage_account').change(function(e){
		resend_url(parent.find('select.selectpage_account').val(),parent);
		e.preventDefault();
	});

	//reload url on pagination click
	parent.find('#table-1.accountlist .pager .pagination a').unbind('click');
	parent.find('#table-1.accountlist .pager .pagination a').click(function(e){
		resend_url(this.href,parent);
		e.preventDefault();
	});


//	$.getScript("/javascripts/table.js", function(data, textStatus, jqxhr) {
		//checkbox click handler
		parent.find('#table-1.accountlist table .custom-checkbox input[type="checkbox"]').unbind('click');
		parent.find('#table-1.accountlist table .custom-checkbox input[type="checkbox"]').on('click', function() {
			table_footer_showhide(parent.find('#table-1.accountlist'));
			
			if ($(this).is(":checked")){
			
				var view_all_selected_accounts =  parent.find('input.assign_accounts').select2('val');	
				view_all_selected_accounts.push($(this).val());
				
				//get the current value of 	
				parent.find('input.assign_accounts').select2('val', view_all_selected_accounts);
			
			}else{
				var removeItem = $(this).val();
				var view_all_selected_accounts = $.grep(parent.find('input.assign_accounts').select2('val'), function(value) {
  					return value != removeItem;
				});

				parent.find('input.assign_accounts').select2('val',view_all_selected_accounts);
			}
		});

		//select-all click handler
		parent.find("#table-1.accountlist .table-footer .select-all").unbind('click');
		parent.find("#table-1.accountlist .table-footer .select-all").click(function() {

			var view_all_selected_accounts = []		
			parent.find('#table-1.accountlist table .custom-checkbox input[type="checkbox"]').each(function(index, value){
				view_all_selected_accounts.push(value.value);
			});

			//merge
			view_all_selected_accounts = $.merge(parent.find('input.assign_accounts').select2('val'), view_all_selected_accounts);

			parent.find('input.assign_accounts').select2('val', view_all_selected_accounts);			
			
			
		});

		//uncheck-all click handler
		parent.find("#table-1.accountlist .table-footer .uncheck-all").unbind('click');
		parent.find("#table-1.accountlist .table-footer .uncheck-all").click(function() {

			var view_all_selected_accounts = parent.find('input.assign_accounts').select2('val');
			
			parent.find('#table-1.accountlist table .custom-checkbox input[type="checkbox"]').each(function(index, value){
				removeItem = value.value;
				
				view_all_selected_accounts = $.grep(view_all_selected_accounts, function(value) {
  					return value != removeItem;
				});
			});

			parent.find('input.assign_accounts').select2('val', view_all_selected_accounts);		


		});
 //   });

    table_footer_showhide(parent.find('#table-1.accountlist'));
}


//resend url function reload page via ajax
function resend_url(url,parent){
		var default_accounts = parent.find('input.assign_accounts').select2("val");	
	$.ajax({
		type : "POST",
		url  : url,
		data:{ 
			"account_ids":default_accounts,
            "ajax_mode" : '1',
            'resend' :'1'
		},
		success:function(data) {      
	    	data = JSON.parse(data);       
	    	create_table_result(data,parent);
		}
	});
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

	//destroys select2 
	$('.assign_userlevels').select2("destroy");
	$('.assign_userlevels').selectmenu("destroy");	

	
		
	$('.assign_accounts').select2("destroy");	
	$('.selectpage_account').select2("destroy");

	
	//create role admin (defaults)
	if(g_assign_useradmin.length > 0)
	{
		var s = add_assign_panel();
		s.find("select.assign_userlevels").each(function() {
//			$(this).select2('val',1);	
			$(this).selectmenu('value',1);	
		});

		s.find("input.assign_accounts").each(function() {
			$(this).select2('val',g_assign_useradmin);	
		});
	}
	

	//create role advanced (defaults)
	if(g_assign_useradvanced.length > 0)
	{
		var s = add_assign_panel();
		s.find("select.assign_userlevels").each(function() {
//			$(this).select2('val',2);	
			$(this).selectmenu('value',2);	
		});

		s.find("input.assign_accounts").each(function() {
			$(this).select2('val',g_assign_useradvanced);	
		});
		
	}

	//create role standard (defaults)
	if(g_assign_userstandard.length > 0)
	{
		var s = add_assign_panel();
		s.find("select.assign_userlevels").each(function() {
			$(this).selectmenu('value',3);	
			$(this).val(3);	
		});

		s.find("input.assign_accounts").each(function() {
			$(this).select2('val',g_assign_userstandard);	
		});
	}
	
	//remove the role assign panel on clicking remove role link
	$('.assign_panel .remove_role').live('click',function() {

		$(this).parents('.assign_panel').find('.assign_userlevels').attr('id', 'destroy');	
		$(this).parents('.assign_panel').find('.assign_userlevels').selectmenu("destroy");
		$(this).parents('.assign_panel').remove();
		
		//count how panel existing
		if($('.assign_panel').length < 3)
		{
			$('#add_assign_panel').show();

		}
		if($('.assign_panel').length == 1)
		{
			$('.assign_panel .remove_role').hide();
		}
		else
		{
			$('.assign_panel .remove_role').show();		
		}

		
	});


	//create a single role on users add, we need to maintain at least one role
	if($('.assign_panel').length == 0)
	{
		var s = add_assign_panel();
		s.find('.remove_role').hide();
	}


	//create a single role on users add, we need to maintain at least one role
	if($('.assign_panel').length == 1)
	{
		$('.assign_panel .remove_role').hide();
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


		(function (){
			//username
			$('#username_validation_error').hide();
			var username = $('#user_form input[name="username"]').focus().val();
	
			//username is required
			/*
			if($.trim(username) == '')
			{
				//offset().top 
				$('#username_validation_error').find('div').text(' Username is required.');
				$('#username_validation_error').show();
				has_error = 1;
				return;
	
			}
			*/
			//username has invalid char
			if(/^[a-zA-Z0-9_@.-]+$/g.test(username) == false && $.trim(username) != '')
			{
	
				$('#username_validation_error').find('div').text('Username has invalid characters.');
				$('#username_validation_error').show();
				has_error = 1;	
				return;	
			}
			
			
			
			//ajax validation for user
			$.ajax({
				async: false,
				type: "POST",
				url: g_user_exist_check_url,
				data:{ 
					"what_submit": "user exist check",
	                "username": ($.trim(username) == '') ? $('#user_form input[name="emailaddress"]').focus().val() : username,
	                "exclude_id" : ($('input[name="user_id"]').length == 0) ? '' : $('input[name="user_id"]').val()
	            },
	            success:function(data) {     
	            	data = JSON.parse(data);       
					if(data.has_error==1)
					{
						has_error = 1;
						$('#username_validation_error').find('div').text('Username already exists!');
						$('#username_validation_error').show();
					}
				}
			});			
			
			if(has_error == 1)
			{
				return;
			}

			
		})();


		(function (){		
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
					return; 
				}
			}
			//invalid password
			if(password.indexOf(" ") != -1)
			{
				$('#password_validation_error').find('div').text('Invalid password.');
				$('#password_validation_error').show();
				has_error = 1;
				return;
			}
			//mismatched
			if(password != cpassword)
			{
				$('#password_validation_error').find('div').text('Password mismatched!');
				$('#password_validation_error').show();
				has_error = 1;
				return;
			}
		})();				





		(function (){	
			//firstname
			$('#firstname_validation_error').hide();
			var firstname = $('#user_form input[name="firstname"]').focus().val();					
	
			//required		
			if($.trim(firstname) == '')
			{
	
				$('#firstname_validation_error').find('div').text('First Name is required.');
				$('#firstname_validation_error').show();
				has_error = 1;
				return;
			}
			
			if(has_error == 1)
			{
				return;
			}
		})();


		(function (){	
			//lastname
			$('#surname_validation_error').hide();
			var surname = $('#user_form input[name="surname"]').focus().val();					
	
			//required		
			if($.trim(surname) == '')
			{
	
				$('#surname_validation_error').find('div').text('Last Name  is required.');
				$('#surname_validation_error').show();
				has_error = 1;
				return;
			}
			
			if(has_error == 1)
			{
				return;
			}
		})();


		
		
		(function (){	
			//email
			$('#emailaddress_validation_error').hide();
			var emailaddress = $('#user_form input[name="emailaddress"]').focus().val();					
	
			//required		
			/*
			if($.trim(emailaddress) == '')
			{
	
				$('#emailaddress_validation_error').find('div').text('Emailaddress is required.');
				$('#emailaddress_validation_error').show();
				has_error = 1;
				return;
			}*/
			
			//invalid
			/*
			if(/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/ig.test(emailaddress) == false)
			{
	
				$('#emailaddress_validation_error').find('div').text('Email Address is invalid.');
				$('#emailaddress_validation_error').show();
				has_error = 1;		
				return;					
			}
			*/

			var arr=[];
		
			$('.assign_panel input[name="assign_accounts[]"]').each(function() {
				arr = $.merge(arr,$(this).select2('val'));
			});
		
			//ajax validation for user
			$.ajax({
				async: false,
				type: "POST",
				url: g_email_exist_check_url,
				data:{ 
					"what_submit": "email exist check",
	                "emailaddress": emailaddress,
	                "assign_accounts" : arr,
	                "exclude_id" : ($('input[name="user_id"]').length == 0) ? '' : $('input[name="user_id"]').val()
	            },
	            success:function(data) {     
	            	data = JSON.parse(data);       
					if(data.has_error==1)
					{
						has_error = 1;
						$('#emailaddress_validation_error').find('div').text('Email Address already exists!');
						$('#emailaddress_validation_error').show();
					}
					else if(data.has_error==2)
					{
						has_error = 1;
						$('#emailaddress_validation_error').find('div').text('Email Address is required!');
						$('#emailaddress_validation_error').show();
					}				
					
				}
			});			
			
			if(has_error == 1)
			{
				return;
			}



		})();	
				

		(function (){	
			//mobilenumber
			$('#mobilenumber_validation_error').hide();
			var mobilenumber = $('#user_form input[name="mobilenumber"]').focus().val();					
			

/*	
			//required		
			if($.trim(mobilenumber) == '')
			{
	
				$('#mobilenumber_validation_error').find('div').text('Mobile number is required.');
				$('#mobilenumber_validation_error').show();
				has_error = 1;
				return;
			}		
*/
/*
1.	Mobile number field is not required, it should allow the + field and it should allow brackets ( and ) and it should allow whitespace. It should just trim all those characters out. All other characters should be rejected with validation.
Also please add a tooltip next to the mobile number field "Please enter the mobile number in International format, for example if your mobile number in Australia is 0406040271, please enter this as 61406040271"

*/
			//number only
			if($.trim(mobilenumber) != '' && /^[\d\+() ]+$/g.test(mobilenumber) == false)
			{
	
				$('#mobilenumber_validation_error').find('div').text('Mobile number is invalid.');
				$('#mobilenumber_validation_error').show();
				has_error = 1;		
				return;
			}		


			//ajax validation for user
			$.ajax({
				async: false,
				type: "POST",
				url: g_mobilenumber_check_url,
				data:{ 

	                "mobilenumber": mobilenumber,
	                "exclude_id" : ($('input[name="user_id"]').length == 0) ? '' : $('input[name="user_id"]').val()
	            },
	            success:function(data) {     
	            	data = JSON.parse(data);       
					if(data.has_error==2)
					{
						has_error = 1;
						$('#mobilenumber_validation_error').find('div').text('Mobile Number already exists!');
						$('#mobilenumber_validation_error').show();
					}

					if(data.has_error==1)
					{
						has_error = 1;
						$('#mobilenumber_validation_error').find('div').text('Mobile number is invalid.');
						$('#mobilenumber_validation_error').show();
					}



				}
			});			
			
			if(has_error == 1)
			{
				return;
			}



		})();	

		//COUNT basic
		var role_counts = [];
		
		role_counts[3] = $('.assign_panel select.assign_userlevels[value=3]').length;
		role_counts[2] = $('.assign_panel select.assign_userlevels[value=2]').length;
		role_counts[1] = $('.assign_panel select.assign_userlevels[value=1]').length;		
		
		//lets now proceed to each role and assign account
		$('.assign_panel').each(function(i,el) {
			$(el).find('select.assign_userlevels').each(function(j,aul) {
				$(el).find('.role_validation_error').hide();
				if($(aul).val() == '')
				{
					$(el).find('.role_validation_error').find('div').text('Role is required.');
					$(el).find('.role_validation_error').show();
					has_error = 1;
				}
				else if(role_counts[$(aul).val()] > 1)
				{
					
					$(el).find('.role_validation_error').find('div').text('Only one '+$(aul).find('option:selected').text()+' role is allowed.');
					$(el).find('.role_validation_error').show();
					has_error = 1;				
				}
			});


			$(el).find('input.assign_accounts').each(function(j,aa) {
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


	//footer show hide on each panel
	$('.assign_panel').each(function(i,el) {
		table_footer_showhide($(el).find('#table-1.accountlist'));
	});

	//view all scripts
	$('.show-table.view-all-list').live('click', function(e){

		$('.view-all-select:visible').not(this).click();


		var anchor =$(this); 

		//get the d of the account
		var default_accounts = anchor.parents('.assign_panel').find('input.assign_accounts').select2("val").toString();	
	
		$.ajax({
			type: "POST",
			url: g_user_view_all_account_url,
			data:{ 
                "account_ids": default_accounts,
                "ajax_mode" : '1'
            },
            success:function(data) {     
            	data = JSON.parse(data);       
            	create_table_result(data, anchor.parents('.assign_panel'));
			}
		});

		e.preventDefault();
	});


	//reinit show-table show-select
  $('form.form-type1 .show-table').die('click');
  $('form.form-type1 .show-select').die('click');

  $('form.form-type1 .show-table').live('click', function() { 
  	
    $(this).parents('.assign_panel').find('.show-table').addClass('hide')
    $(this).parents('.assign_panel').find('.multiple-select').addClass('hide')
    $(this).parents('.assign_panel').find('.show-select').removeClass('hide')
    $(this).parents('.assign_panel').find('#table-1').removeClass('hide')
    return false;
  });

  $('form.form-type1 .show-select').live('click', function() { 
    $(this).parents('.assign_panel').find('.show-select').addClass('hide')
    $(this).parents('.assign_panel').find('#table-1').addClass('hide')
    $(this).parents('.assign_panel').find('.multiple-select').removeClass('hide')
    $(this).parents('.assign_panel').find('.show-table').removeClass('hide')
    return false;
  });


	//reinit select-all 	
  $(".select-all").die("click");
  $(".select-all").live("click", function() {
	var container =  $(this).parents('div.table-box');
      container.find("input:checkbox").each(function() {
      this.checked = "checked";
      var checkboxID = $(this).attr('class').substr(9,3);
      var trashID =  'td.trash-' + checkboxID
      var trID =   'tr.item-' + checkboxID

      if($(this).attr('checked') == 'checked') {
        container.find(trashID).addClass('showicons')
        container.find(trID).addClass('selected')
        container.find('.table-footer-1').css('display','none')
        container.find('.table-footer-2').css('display','block')
      } else {
        container.find(trashID).removeClass('showicons')
        container.find(trID).removeClass('selected')
        container.find('.table-footer-1').css('display','block')
        container.find('.table-footer-2').css('display','none')
      }
		$(this).trigger('change');
    });
  });

	//reinit uncheck-all
  $(".uncheck-all").die("click");
  $(".uncheck-all").live("click", function() {
	var container =  $(this).parents('div.table-box');
      container.find("input:checkbox").each(function() {
      $(this).removeAttr('checked');
      var checkboxID = $(this).attr('class').substr(9,3);
      var trashID = 'td.trash-' + checkboxID
      var trID = 'tr.item-' + checkboxID

      container.find(trashID).removeClass('showicons')
      container.find(trID).removeClass('selected')
      container.find('.table-footer-1').css('display','block')
      container.find('.table-footer-2').css('display','none')
		$(this).trigger('change');
    });
  });



    //CANCEL DIALOG ACTION
    $('#confirm1 button.close, #confirm2 button.close').click(function(){
    	g_items = [];
	});


    //CANCEL BUTTON ACTION
    $('#confirm1 .modal-footer > a#DeleteCancel.btn').click(function(){
		g_items = [];
	    $('#confirm1').modal('hide');
	});
	

	//SINGLE DELETE ACTION
    $('#form_delete').click(function(){
    	//reset the arrays
    	g_items = [];
    	
        g_items.push( $('input[name="user_id"]').val());


        if(g_items.length>0){
            group_name = $('input[name="saved_user_name"]').val();
            group_name = group_name.replace(/<[^>]*>/,"");
            group_name = group_name.replace(/(<.*>)/,"");
            alt_message = "You are about to delete the user: <br/> '"+group_name+"'. ";
            confirm_delete(alt_message);
        }
    });


	//SINGLE DELETE ACTION
    $('#form_reinstate').click(function(){
    	//reset the arrays
    	g_items = [];
    	
        g_items.push( $('input[name="user_id"]').val());


        if(g_items.length>0){
            group_name = $('input[name="saved_user_name"]').val();
            group_name = group_name.replace(/<[^>]*>/,"");
            group_name = group_name.replace(/(<.*>)/,"");
            alt_message = "You are about to reinstate the user: <br/> '"+group_name+"'. ";
            confirm_delete(alt_message);
        }
    });



	//ACCEPT ACTION
	$('#confirm1 .modal-footer > a#DeleteAccept.btn').click(function(){
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: g_user_delete_url,
        data:{ 
            "what_submit" : "delete users",
            "users":g_items
        },
        success:function(data) {  
        	$('#ajax_loading').hide();
        	if (typeof(data.error) != 'undefined')
			{ 
				show_top_notification(data.error, 'error');
			}
			else
			{
	            g_items = [];
	            //refresh this page
				window.location.assign(g_user_main_url);
			}       
          },
		error: function(xhr, textStatus, errorThrown){
			$('#ajax_loading').hide();
			show_top_notification('An unexpected error occurred. Please try again.', 'error');
		}
          
      });                   
	});   

	//ACCEPT ACTION
	$('#confirm1 .modal-footer > a#ReinstateAccept.btn').click(function(){
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: g_user_reinstate_url,
        data:{ 
            "what_submit" : "reinstate users",
            "users":g_items
        },
        success:function(data) {  
        	$('#ajax_loading').hide();
        	if (typeof(data.error) != 'undefined')
			{ 
				show_top_notification(data.error, 'error');
			}
			else
			{
	            g_items = [];
	            //refresh this page
				window.location.assign(g_user_deleted_main_url);
			}       
          },
		error: function(xhr, textStatus, errorThrown){
			$('#ajax_loading').hide();
			show_top_notification('An unexpected error occurred. Please try again.', 'error');
		}
          
      });                   
	});  

	
	//EVENTS FOR select2
	$('.assign_panel .assign_accounts').live("change", function(e) {
			var el = $(this);
			$('.view-all-select:visible').click();
			
		});
	
	

					
});
	

	

