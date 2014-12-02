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



function create_table_result(data,parent){

	if (data.rulesandtriggers == undefined){
		$('#rtnolist').show();
		$('#rtlist').hide();		
		return;
	}
	
	if (data.rulesandtriggers.length == 0){
		$('#rtnolist').show();
		$('#rtlist').hide();		
		return;
	}
	
		$('#rtnolist').hide();
		$('#rtlist').show();		
		
	
	

	html = '';
	htmlhead = '';
	
	//generate table head
	htmlhead += '<tr>';
	htmlhead += '<th colspan="1" class="first"><a href="'+data.base_url+'/name/'+data.sort_by_name+'/'+data.limit+'/'+data.offset+'">Name</a></th>';

	htmlhead += '<th colspan="1"><a href="'+data.base_url+'/name/'+data.sort_by_direction+'/'+data.limit+'/'+data.offset+'">Applies When</a></th>';

	htmlhead += '<th colspan="1"><a href="'+data.base_url+'/name/'+data.sort_by_account_name+'/'+data.limit+'/'+data.offset+'">Account</a></th>';

	htmlhead += '<th colspan="1"><a href="'+data.base_url+'/numbers/'+data.sort_by_numbers+'/'+data.limit+'/'+data.offset+'">Numbers</a></th>';
	htmlhead += '<th colspan="1"></th>';
	htmlhead += '<th colspan="1"></th>';
	htmlhead += '<th class="last" colspan="1"></th>';
	htmlhead += '</tr>';
	parent.find('#table-1.rulelist table thead').html(htmlhead);
	
	parent.find('#table-1.rulelist table thead a').click(function(e){
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
	parent.find('select.selectpage_rule').selectmenu('destroy');
	parent.find('select.selectpage_rule').select2('destroy');

	//add html
	parent.find('#table-1.rulelist .selectpage ul select').html(htmlselectpage);
	parent.find('select.selectpage_rule').select2();

	//checkboxes
	add_checked = '';
	if (data.rulesandtriggers != undefined){
		c = 1;
		$.each(data.rulesandtriggers, function(index, rule) {
			html += '<tr class="item-'+c+' item-row">';
			var name = (rule.name == null || rule.name == '') ? 'n/a' : rule.name;

			if(rule.is_admin == '1') name = '<a href="'+g_base_url + 'settings/rules/edit/' +rule.id+'">'+ name + '</a>';

			html += '<td class="col_name">'+name+'</td>';
			var dir = (rule.direction == 1) ? 'Recieving' : 'Sending'; 
			html += '<td>'+dir+'</td>';
			
			var account_name = (rule.account_name == null || rule.account_name == '') ? 'n/a' : rule.account_name;
			if(rule.is_admin == '1') account_name = '<a href="'+g_base_url + 'account/search/id/' +rule.account_id+'">'+ account_name + '</a>';

			html += '<td>'+account_name+'</td>';
			html += '<td>'+rule.numbers+'</td>';
			add_checked = '';			
	
			
			if(rule.is_admin == '1')
			{		
				html += '<td class="trash trash-'+c+'"><a data-original-title="Delete this item" data-placement="right" href="javascript:void(0);" class="icon-trash">Trash</a></td>';
				
				html += '<td><span class="custom-checkbox"><input type="checkbox" '+add_checked+' data-userid="'+rule.userid+'" class="checkbox-'+c+'" value="'+rule.id+'"><span class="box"><span class="tick"></span></span></span></td>';
			}
			else
			{
				html += '<td class="trash trash-'+c+'"></td>';
				
				html += '<td></td>';			
			}
			
			html += '<td class="last"></td>';
			html += '</tr>';
			
			c++;
		});
	}

	parent.find('#table-1.rulelist table tbody').html(html);

	//generate pagination
	parent.find('#table-1.rulelist .pager .pagination').html(data.pagination);

	offset_desc = parseInt(data.offset) + 1;
	limit_desc = parseInt(data.limit) + parseInt(data.offset);
	showing_results_txt = 'Showing results '+offset_desc+' - '+limit_desc+' of '+data.numrulesandtriggers;
	parent.find('#table-1.rulelist .footer .showresult').html(showing_results_txt);

	//reload url on select page change
	parent.find('select.selectpage_rule').unbind('change');
	parent.find('select.selectpage_rule').change(function(e){
		resend_url(parent.find('select.selectpage_rule').val(),parent);
		e.preventDefault();
	});

	//reload url on pagination click
	parent.find('#table-1.rulelist .pager .pagination a').unbind('click');
	parent.find('#table-1.rulelist .pager .pagination a').click(function(e){
		resend_url(this.href,parent);
		e.preventDefault();
	});


//	$.getScript("/javascripts/table.js", function(data, textStatus, jqxhr) {
		//checkbox click handler
		parent.find('#table-1.rulelist table .custom-checkbox input[type="checkbox"]').unbind('click');
		parent.find('#table-1.rulelist table .custom-checkbox input[type="checkbox"]').on('click', function() {
			table_footer_showhide2(parent.find('#table-1.rulelist'));
		});

 //   });

    table_footer_showhide2(parent.find('#table-1.rulelist'));
}



//show the footer or hide the footer on the table

function table_footer_showhide2(parent){
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


//resend url function reload page via ajax
function resend_url(url,parent){
	$.ajax({
		type : "POST",
		url  : url,
		data:{ 
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
	                "number_id": $('input[name="number_id"]').val()
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



	//for RT table
		$.ajax({
		type: "POST",
		url: g_partner_rules_search_by_number_url,
		data:{ 
            "ajax_mode" : '1'
        },
        success:function(data) {     
        	data = JSON.parse(data);  

        	create_table_result(data,$('#rtlist'));
		}
	});
	
	
	//delete action
	    //CANCEL DIALOG ACTION
    $('#confirm1 button.close, #confirm2 button.close').click(function(){
    	g_items = [];
    	g_users = [];   	
		g_name = '';
	});

    //CANCEL BUTTON ACTION
    $('#confirm1 .modal-footer > a#DeleteCancel.btn').click(function(){
    	g_items = [];
    	g_users = [];   	
		g_name = '';

	    $('#confirm1').modal('hide');
	});
    	

	//SINGLE DELETE ACTION
    $('.icon-trash').live('click',function(){
    	//reset the arrays
    	g_items = [];
    	g_users = [];   	
		g_name = '';
		
        var delete_item_id = $(this).parents('.item-row').find(':checkbox').val();
        g_items.push(delete_item_id);
		g_users.push($(this).parents('.item-row').find(':checkbox').data('userid'));
		


        if(g_items.length>0){
            group_name = $(this).parents('.item-row').find('.col_name').html();
            group_name = group_name.replace(/<[^>]*>/,"");
            group_name = group_name.replace(/(<.*>)/,"");
            g_name = group_name;
            alt_message = "You are about to delete the rule: <br/> '"+group_name+"'. ";
            confirm_delete(alt_message);
        }
    });



	//MULTIPLE DELETE ACTION		    
    $('#table-footer-2 > a#link-delete-selected').live('click',function(){
    	//reset the arrays
    	g_items = [];
    	g_users = [];   	
		g_name = '';
        //get all the checkbox that are checked
	     $(this).parents('.table-box ').find('.custom-checkbox input:checked').each(function() {
	     	g_items.push($(this).val());
	     	g_users.push($(this).data('userid'));
	     });

        if(g_items.length>0){
            if(g_items.length > 1){
                alt_message = "You are about to delete "+g_items.length +" rules. ";
            }else{
                group_name =  $(this).parents('.table-box ').find('.custom-checkbox input:checked').parents('.item-row').find('.col_name').html();
                group_name = group_name.replace(/<[^>]*>/,"");
                group_name = group_name.replace(/(<.*>)/,"");
                alt_message = "You are about to delete the rule: <br/> '"+group_name+"'. ";
                g_name = group_name;
            }

            confirm_delete(alt_message);
        }else{  
			confirm_noselected("You haven't selected any rules to delete. ", "Delete Rules and Triggers");
        }
    });
    	
	//ACCEPT ACTION
	$('#confirm1 .modal-footer > a#DeleteAccept.btn').click(function(){
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: g_rule_delete_url,
        data:{ 
              "what_submit" : "delete rules",
                "rules":g_items,
                "rulename":g_name,
                "ruleusers":g_users,
                "ajax_mode":1
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
		    	g_users = [];   	
				g_name = '';
	            //refresh this page
	            //window.location.reload(true); 
				resend_url(g_partner_rules_search_by_number_url,$('#rtlist'));
				 $('#confirm1').modal('hide');
				  $('#confirm2').modal('hide');
				show_top_notification(data.success, 'success');

			}       
          },
		error: function(xhr, textStatus, errorThrown){
			$('#ajax_loading').hide();
			show_top_notification('An unexpected error occurred. Please try again.', 'error');
		}
          
      });                   
	});   



});