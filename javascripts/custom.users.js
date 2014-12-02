function dataFormatResult(data) {
    var markup = "<table class='movie-result'><tr>";
   
    markup += "<td class='data-info'><div class='data-title'>" + data.name + "</div>";
 
    markup += "</td></tr></table>"
    return markup;
}

function dataFormatSelection(data) {
    return data.name;
}

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


//SEARCH CLICK ON ACCOUNT NAME LONG
function click_long_account(el) {

		//choose the search keyword
		$('input[name="search_keyword"]').val($(el).html());
		
		//choose the type
		$('input[name="search_by"][value="account"]').attr('checked',true);
		
		//click the search
		$('#filter_search').click();
	};



//MAIN DOCUMENT READY SECTION
$(function(){

$('.ui-selectmenu-status').css({'font-weight': 'normal', 'font-size':'12px', 'color':'#666666'});


	//ITEM DETAIL CLICK
  $('.item-detail-view').click(function(){
    var item = this;
    item_id = $(item).parents('.item-row').find(':checkbox').val();
    var is_visible = $(item).parents('.item-row').next('.detail').is(':visible');

    $(item).parents('.item-row').next('.detail').hide();
    
    if (is_visible){
      $.ajax({
        type: "POST",
        url: g_user_account_url,
        data:{ 
            "what_submit" : "get account list",
            "user_id":item_id
        },
        success:function(data) {    
          jdata = JSON.parse(data);
      
          
/*          
            var html = '<ul class="unstyled detail-ul" style ="padding-right:430px;">';
            
            $.each(jdata.accounts, function() {
              html += '<li><a href="javascript:void(0)" onclick="click_long_account(this);" class="click_long_account">'+this.name+'</a></li>';
            });

            if(parseInt($(item).html()) > 3)
            {
              html += '<li><a href="'+g_set_user_search_url+'/'+item_id+'">view all</a></li>';            	
            }
            
            html += '</ul>';
*/

          if (jdata.success == true){
            
            var html = '<table><tbody>';
             
            $.each(jdata.accounts, function() {
				var accountname = (this.name == '') ? 'n/a' : this.name;
				if (accountname.length > 33) accountname = accountname.substr(0,30) + '...';
				if(this.children > 0) 
					accountname = '<a href="'+g_base_url+'dashboard/'+this.id+'">'+accountname+'</a>';
				else
					accountname = '<a href="'+g_base_url+'account/edit/'+this.id+'">'+accountname+'</a>';					
				
				var parentname = (this.parent_name == '') ? 'n/a' : this.parent_name;
				if (parentname.length > 33) parentname = parentname.substr(0,30) + '...';				
				
				if(this.parent_id > 4) parentname = '<a href="'+g_base_url+'dashboard/'+this.parent_id+'">'+parentname+'</a>';

				var sms_balance = (this.sms_balance < 50) ? '<span class="c-red">'+this.sms_balance+'</span>' : '<span>'+this.sms_balance+'</span>' ;

              html += '<tr class="item-row"> ';
              html += '<td width="35%" class="first">Account Name: <strong>'+accountname+'</strong></td>';	
              html += '<td width="35%">Parent Account: <strong>'+parentname+'</strong></td>';	
              html += '<td>SMS Sent: <strong>'+this.sms_sent+'</strong></td>';	
              html += ((this.paymentmodel == 1) ? '<td>SMS Balance: <strong>'+ sms_balance +'</strong></td>' : '<td></td>' );	                                        
              html += '<td class="last"></td>';	 
              html += '</tr> ';
            });


			html += '                            <tr class="item-xtra">';
			html += '                              <td colspan="4" class="first">';
			html += '                                  <a class="btn btn-small btn-info" href="'+g_set_user_search_url+'/'+item_id+'" style="float:left;"><span>View All Accounts</span></a>';

			//html += '                                  <a class="btn btn-small btn-success" href="'+g_base_url+'users/add'+'" style="float:left;"><span>Add a User</span></a>';
			html += '                              </td>';
			html += '                              <td class="last"></td>';
			html += '                            </tr>';



 
 			html += '</tbody></table>';

            
            $(item).parents('.item-row').next('.detail').children('td').html(html);
            $(item).parents('.item-row').next('.detail').show();
          }
        }
      });        
    }
  });


	//get all the checkbox that are checked
	$('.custom-checkbox input:checked').each(function() {
		 $(this).parent().parent().parent().addClass('selected');
		    $(this).parents('.table-box ').find('#table-footer-2').show();
			$(this).parents('.table-box ').find('#table-footer-1').hide();
	});			




//DELETE ACTIONS


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
    $('.icon-trash').click(function(){
    	//reset the arrays
    	g_items = [];
    	

        var delete_item_id = $(this).parents('.item-row').find(':checkbox').val();
        g_items.push(delete_item_id);


        if(g_items.length>0){
            group_name = $(this).parents('.item-row').find('.col_username').val();
            group_name = group_name.replace(/<[^>]*>/,"");
            group_name = group_name.replace(/(<.*>)/,"");
            alt_message = "You are about to delete the user: <br/> '"+group_name+"'. ";
            confirm_delete(alt_message);
        }
    });


	//MULTIPLE DELETE ACTION		    
    $('#table-footer-2 > a#link-delete-selected').click(function(){
    	//reset the arrays
    	g_items = [];
        //get all the checkbox that are checked
	     $(this).parents('.table-box ').find('.custom-checkbox input:checked').each(function() {
	     	g_items.push($(this).val());
	     });

        if(g_items.length>0){
            if(g_items.length > 1){
                alt_message = "You are about to delete "+g_items.length +" users. ";
            }else{
                group_name =  $(this).parents('.table-box ').find('.custom-checkbox input:checked').parents('.item-row').find('.col_username').val();
                group_name = group_name.replace(/<[^>]*>/,"");
                group_name = group_name.replace(/(<.*>)/,"");
                alt_message = "You are about to delete the user: <br/> '"+group_name+"'. ";
            }

            confirm_delete(alt_message);
        }else{  
			confirm_noselected("You haven't selected any users to delete. ", "Delete User(s)");
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
	            window.location.reload(true); 
			}       
          },
		error: function(xhr, textStatus, errorThrown){
			$('#ajax_loading').hide();
			show_top_notification('An unexpected error occurred. Please try again.', 'error');
		}
          
      });                   
	});   



//ASSIGN TO ACCOUNT

    //CANCEL DIALOG ACTION
    $('#confirm3 button.close').click(function(){
    	g_items = [];
	});

    //CANCEL BUTTON ACTION
    $('#confirm3 .modal-footer > a#AssignCancel.btn').click(function(){
		g_items = [];
	    $('#confirm3').modal('hide');
	});


	//SINGLE ASSIGN ACTION
    $('.icon-unsubcribed').click(function(){
    	//reset the arrays
    	g_items = [];

		//just clear the val
		if($('#assign_account').length > 0)
		{
			$('#assign_account').select2('val',[]);
		}
		else
		{
			$('#select2').select2('val',[]);		
		}
		
        var assign_item_id = $(this).parents('.item-row').find(':checkbox').val();
        g_items.push(assign_item_id);


        if(g_items.length>0){
            group_name = $(this).parents('.item-row').find('.col_username').val();
            group_name = group_name.replace(/<[^>]*>/,"");
            group_name = group_name.replace(/(<.*>)/,"");
            $('#confirm3 #alt_assignuser').html("user: " + group_name);
            
            $('#assign_account_Info').hide();
			$('#confirm3').modal();
        }
    });


	//MULTIPLE ASSIGN ACTION		    
    $('#table-footer-2 > a#link-assignaccount-selected').click(function(){
    	//reset the arrays
    	g_items = [];
    	
    			//just clear the val
		if($('#assign_account').length > 0)
		{
			$('#assign_account').select2('val',[]);
		}
		else
		{
			$('#select2').select2('val',[]);		
		}

    	
        //get all the checkbox that are checked
	     $(this).parents('.table-box ').find('.custom-checkbox input:checked').each(function() {
	     	g_items.push($(this).val());
	     });

        if(g_items.length>0){
            if(g_items.length > 1){
            
            	$('#confirm3 #alt_assignuser').html(g_items.length + " users");

            }else{
                group_name =  $(this).parents('.table-box ').find('.custom-checkbox input:checked').parents('.item-row').find('.col_username').val();
                group_name = group_name.replace(/<[^>]*>/,"");
                group_name = group_name.replace(/(<.*>)/,"");
                $('#confirm3 #alt_assignuser').html("user: " + group_name);
            }
            $('#assign_account_Info').hide();
			$('#confirm3').modal();
        }else{  
			confirm_noselected("You haven't selected any users to assign to account. ", "Assign to Account(s)");
        }
    });






	//AJAX for super user search on assign to account dialog
    $('#assign_account').select2({
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
    	        var more = (page * 10) < data.total;
    			return {results: data.items, more: more};
    		}
    	},
    	formatResult: dataFormatResult, // omitted for brevity, see the source of this page
    	formatSelection: dataFormatSelection, // omitted for brevity, see the source of this page
    	dropdownCssClass: "bigdrop" // apply css that makes the dropdown taller
    });
	    


	//ACCEPT ACTION
	$('#confirm3 .modal-footer > a#AssignAccept.btn').click(function(){

		if($('input[name="assign_account"]').length > 0)
		{
			var assign_account = $('input[name="assign_account"]');
		}
		else
		{
			var assign_account = $('#select2');
		
		}

		//do some validation first
		if(assign_account.val() == '' || assign_account.val() == null){

			$('#assign_account_Info').find('div').text('At least 1 account is required');
			$('#assign_account_Info').css('display','inline-block');
			return false;
		}

	
	    $.ajax({
	        type: "POST",
	        dataType: 'json',
	        url: g_user_assign_account_url,
	        data:{ 
	            "what_submit" : "assign to account",
	            "users":g_items,
	            "accounts": assign_account.val(),
	            "role": $('select[name="assign_role"]').val()
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
		            window.location.reload(true); 
				}       
	          },
			error: function(xhr, textStatus, errorThrown){
				$('#ajax_loading').hide();
				show_top_notification('An unexpected error occurred. Please try again.', 'error');
			}
	          
	      });                   
	});   

	//VIEW ALL ACCOUNTS
	$('#view_all_accounts').click(function() {
		
		if(g_new_window_va_account == null || g_new_window_va_account.closed)
		{

			g_new_window_va_account = window.open(g_user_view_all_account_url,'view_alladminaccounts','location=0,scrollbars=1,resizable=1,height=700,width=780');
		}
		if (window.focus) {g_new_window_va_account.focus()}	
	});


//SEARCH CLICK ON ACCOUNT NAME SHORT
	$('.click_short_account').click(function() {
		//choose the search keyword
		$('input[name="search_keyword"]').val($(this).next('.col_account').val());
		
		//choose the type
		$('input[name="search_by"][value="account"]').attr('checked',true);
		
		//click the search
		$('#filter_search').click();
	});



//destroy
$('select[name="assign_role"]').select2('destroy');
$('select[name="assign_role"]').selectmenu('destroy');
$('select[name="assign_role"]').selectmenu({style:'dropdown', maxHeight: 170});

});
