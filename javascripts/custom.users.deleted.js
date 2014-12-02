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


//REINSTATE DIALOG CALL
function confirm_reinstate(alt_message){
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

          if (jdata.success == true){
            html = '<ul class="unstyled detail-ul" style ="padding-right:430px;">';
            
            $.each(jdata.accounts, function() {
//              url = "<?php echo base_url() . 'contacts/group/'?>"+this.id;
              html += '<li><a href="javascript:void(0)" onclick="click_long_account(this);" class="click_long_account">'+this.name+'</a></li>';
            });
            

            if(parseInt($(item).html()) > 3)
            {
              html += '<li><a href="'+g_set_user_search_url+'/'+item_id+'">view all</a></li>';            	
            }
            
            html += '</ul>';
            
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




//REINSTATE ACTIONS


    //CANCEL DIALOG ACTION
    $('#confirm1 button.close, #confirm2 button.close').click(function(){
    	g_items = [];
	});

    //CANCEL BUTTON ACTION
    $('#confirm1 .modal-footer > a#ReinstateCancel.btn').click(function(){
		g_items = [];
	    $('#confirm1').modal('hide');
	});
    	
	//SINGLE REINSTATE ACTION
    $('.icon-unsubcribed').click(function(){
    	//reset the arrays
    	g_items = [];
    	

        var reinstate_item_id = $(this).parents('.item-row').find(':checkbox').val();
        g_items.push(reinstate_item_id);


        if(g_items.length>0){
            group_name = $(this).parents('.item-row').find('.col_username').val();
            group_name = group_name.replace(/<[^>]*>/,"");
            group_name = group_name.replace(/(<.*>)/,"");
            alt_message = "You are about to reinstate the user '"+group_name+"'. ";
            confirm_reinstate(alt_message);
        }
    });


	//MULTIPLE REINSTATE ACTION		    
    $('#table-footer-2 > a#link-reinstate-selected').click(function(){
    	//reset the arrays
    	g_items = [];
        //get all the checkbox that are checked
	     $(this).parents('.table-box ').find('.custom-checkbox input:checked').each(function() {
	     	g_items.push($(this).val());
	     });

        if(g_items.length>0){
            if(g_items.length > 1){
                alt_message = "You are about to reinstate "+g_items.length +" users. ";
            }else{
                group_name =  $(this).parents('.table-box ').find('.custom-checkbox input:checked').parents('.item-row').find('.col_username').val();
                group_name = group_name.replace(/<[^>]*>/,"");
                group_name = group_name.replace(/(<.*>)/,"");
                alt_message = "You are about to reinstate the user '"+group_name+"'. ";
            }

            confirm_reinstate(alt_message);
        }else{  
			confirm_noselected("You haven't selected any users to reinstate. ", "Reinstate User(s)");
        }
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
	            window.location.reload(true); 
			}       
          },
		error: function(xhr, textStatus, errorThrown){
			$('#ajax_loading').hide();
			show_top_notification('An unexpected error occurred. Please try again.', 'error');
		}
          
      });                   
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






});