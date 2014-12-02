var emails=[];
var emailname='';
var emailusers=[];

function confirm_delete(alt_message){
	$('#confirm1 .modal-body').html(alt_message);
    $('#confirm1').modal();
 }




$(document).ready(function() {



        $("input[name=sendfrom]").change(function(){
            if ($("#sendfrom1").is(':checked'))
            {
                $("#bynumber").hide();
                $("#byname").show();
            }
            else
            {
                $("#byname").hide();
                $("#bynumber").show();
            }
        });
        
        $('#info-wildcard').tooltip();
        $('#info-sendername').tooltip();
    
		  $("input[name=sendfrom]").change();

	    //cancel dialog
	    $('#confirm1 button.close ').click(function(){
        	emails=[];
        	emailname='';
			emailusers=[];
    	});
    

	    //cancel button
	    $('#confirm1 .modal-footer > a#cancel.btn').click(function(){
 	      	 emails=[];
        	emailname='';
			emailusers=[]; 	      	 
 
    	    $('#confirm1').modal('hide');
    
    	});
    	
   
   	//delete function
    	//trash click
	    $('.icon-trash').click(function(){
	    	//reset the arrays
	    	emails=[];
        	emailname='';
			emailusers=[];
	   
	       var delete_item_id = $(this).parent().next().children().children(':checkbox').val();
		   var emailusers_id = $(this).parent().next().children().children(':checkbox').val();	
			
	        emails.push(delete_item_id);
			emailusers.push(emailusers_id);
	        
	        if(emails.length>0){
	            group_name = $(this).parent().prev().prev().prev().html();
	            group_name = group_name.replace(/<[^>]*>/,"");
	            group_name = group_name.replace(/(<.*>)/,"");
	
	            alt_message = "You are about to delete the item '"+group_name+"'. ";
				emailname=group_name;
	            confirm_delete(alt_message);
	        }
	    });
		

//multiple delete		    
	    $('#table-footer-2 > a#emails-delete-selected').click(function(){
	    
	    	//reset the arrays
	    	emails=[];
        	emailname='';
			emailusers=[];
	        
	        //get all the checkbox that are checked
		     $(this).parents('.table-box ').find('.custom-checkbox input:checked').each(function() {
		     	emails.push($(this).val());
				emailusers.push($(this).data('userid'));
		     });
	
	        if(emails.length>0){
	            if(emails.length > 1){
	                alt_message = "You are about to delete "+emails.length +" item(s). ";
	            }else{
	                group_name =  $(this).parents('.table-box ').find('.custom-checkbox input:checked').parent().parent().prev().prev().prev().prev().html();
	                group_name = group_name.replace(/<[^>]*>/,"");
	                group_name = group_name.replace(/(<.*>)/,"");
					emailname=group_name;
	                alt_message = "You are about to delete the item '"+group_name+"'. ";
	            }
	
	            confirm_delete(alt_message);
	        }else{  
	            $('#confirm2').modal();
	        }
	
	    });

 	
        $('.table').find('input').click(function(){
            if (this.checked)
                $(this).parents().parent().parent().addClass('selected');
            else
                $(this).parent().parent().parent().removeClass('selected');
        });

        //get all the checkbox that are checked
	     $('.custom-checkbox input:checked').each(function() {
	     	 $(this).parent().parent().parent().addClass('selected');
	     	    $(this).parents('.table-box ').find('#table-footer-2').show();
       			$(this).parents('.table-box ').find('#table-footer-1').hide();
	     });			

        $('.icon-trash').tooltip();	
        
        
        		//------------ ACCEPT
    	$('#confirm1 .modal-footer > a#accept.btn').click(function(){
        $.ajax({
            type: "POST",
            url: '/settings/deleteemailtosms',
            data:{ 
                "what_submit" : "delete emailtosms",
                "emails":emails,
                "emailname":emailname,
                "emailusers":emailusers
            },
            success:function(data) {          
                emails=[];
	        	emailname='';
				emailusers=[];
                //refresh this page
                window.location.reload(true); 
              }
          });                   
    	});    	



});