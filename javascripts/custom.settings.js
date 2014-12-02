var rules=[];
var rulename='';
var ruleusers=[];


function confirm_rt_delete(alt_message){
	$('#confirm1 .modal-body').html(alt_message);
    $('#confirm1').modal();
 }


var emails=[];
var emailname='';
var emailusers=[];

function confirm_ets_delete(alt_message){
	$('#confirm3 .modal-body').html(alt_message);
    $('#confirm3').modal();
 }

var numberids=[];


function confirm_cancel(alt_message){
	$('#confirm_cancel .modal-body').html(alt_message);
    $('#confirm_cancel').modal();
}

function acceptandsubmit()
{
    document.foform.submit();
}



function deleteall()
{
	$('#deleteonefield').val('');
        var c = $("#table-template input:checkbox:checked").length;
        $('#deleteone #myModalLabel').html('Delete Template(s)');
        $('#deleteone #mb').html('You are about to delete '+c+' template(s)');
        $('#deleteone').modal();

}

function deleteone(id, name)
{
	$('#deleteone #myModalLabel').html('Delete a Template');
	$('#deleteone #mb').html('Are you sure you want to delete \''+name+'\'.');
	$('#deleteonefield').val(id);
}



$(document).ready(function() {

    $('#table-template .icon-trash').click(function(){
        $('#deleteone').modal();
    });

    $('#close1').click(function(){
        $('#deleteone').modal('hide');
    });





    $('#confirm_cancel button.close ').click(function(){
    	numberids=[];
	});

    //cancel button
    $('#confirm_cancel .modal-footer > a#cancel.btn').click(function(){
	      	 numberids=[];

	    $('#confirm_cancel').modal('hide');

	});



	$('#numbers .icon-trash').click(function(){
		numberids=[];

		delete_item_id = $(this).parent().next().children().children(':checkbox').val();

		numberids.push(delete_item_id);

		if(numberids.length>0){
	        number = $(this).parent().prev().prev().prev().prev().html();
	        number = number.replace(/<[^>]*>/,"");
	        number = number.replace(/(<.*>)/,"");

	        alt_message = "You are about to cancel the number '"+number+"'. ";

	        
	        confirm_cancel(alt_message);
	   	}
	});


	$('#numbers .table-footer-2 > a#numbers-cancel-selected').click(function(){
	    
	    	//reset the arrays
	    	numberids=[];

	        
	        //get all the checkbox that are checked
		     $(this).parents('.table-box ').find('.custom-checkbox input:checked').each(function() {
		     	numberids.push($(this).val());

		     });
			
	        if(numberids.length>0){
	            if(numberids.length > 1){
	                alt_message = "You are about to cancel "+numberids.length +" number(s). ";
	            }else{
	                number =  $(this).parents('.table-box ').find('.custom-checkbox input:checked').parent().parent().prev().prev().prev().prev().prev().html();
	                number = number.replace(/<[^>]*>/,"");
	                number = number.replace(/(<.*>)/,"");
	
	                alt_message = "You are about to delete the number '"+number+"'. ";
	               
	            }
				 
	            confirm_cancel(alt_message);
	        }else{  
	            $('#confirm_cancel_select').modal();
	        }
	
	    });



	$('#confirm_cancel .modal-footer > a#accept.btn').click(function(){
        $.ajax({
            type: "POST",
            url: '/settings/cancelnumbers',
            data:{ 
                "what_submit" : "delete rules",
                "numberids":numberids
            },
            success:function(data) {          
                numberids=[];

                //refresh this page
                window.location.reload(true); 
              }
          });                   
    }); 












	    //cancel dialog
	    $('#confirm1 button.close ').click(function(){
        	rules=[];
        	rulename='';
        	ruleusers=[];
    	});
    	
    		    //cancel button
	    $('#confirm1 .modal-footer > a#cancel.btn').click(function(){
 	      	 rules=[];
 	      	 rulename='';
 			 ruleusers=[];
    	    $('#confirm1').modal('hide');
    
    	});

		    $('#rules .icon-trash').click(function(){
	    	//reset the arrays
	    	rules=[];
			rulename='';
	   		ruleusers=[];
	      var  delete_item_id = $(this).parent().next().children().children(':checkbox').val();
	      var  ruleusers_id = $(this).parent().next().children().children(':checkbox').data('userid');	      

	        rules.push(delete_item_id);
			ruleusers.push(ruleusers_id);
	        
	        if(rules.length>0){
	            group_name = $(this).parent().prev().prev().prev().prev().html();
	            group_name = group_name.replace(/<[^>]*>/,"");
	            group_name = group_name.replace(/(<.*>)/,"");
	
	            alt_message = "You are about to delete the item '"+group_name+"'. ";
				rulename=group_name;
	            confirm_rt_delete(alt_message);
	        }
	    });


	    $('#rules #table-footer-2 > a#rules-delete-selected').click(function(){
	    
	    	//reset the arrays
	    	rules=[];
			rulename='';
	        ruleusers=[];
	        //get all the checkbox that are checked
		     $(this).parents('.table-box ').find('.custom-checkbox input:checked').each(function() {
		     	rules.push($(this).val());
				ruleusers.push($(this).data('userid'));
		     });
	
	        if(rules.length>0){
	            if(rules.length > 1){
	                alt_message = "You are about to delete "+rules.length +" item(s). ";
	            }else{
	                group_name =  $(this).parents('.table-box ').find('.custom-checkbox input:checked').parent().parent().prev().prev().prev().prev().prev().html();
	                group_name = group_name.replace(/<[^>]*>/,"");
	                group_name = group_name.replace(/(<.*>)/,"");
					rulename=group_name;
	                alt_message = "You are about to delete the item '"+group_name+"'. ";
	            }
	
	            confirm_rt_delete(alt_message);
	        }else{  
	            $('#confirm2').modal();
	        }
	
	    });


	   	$('#confirm1 .modal-footer > a#accept.btn').click(function(){
        $.ajax({
            type: "POST",
            url: '/settings/deleterules',
            data:{ 
                "what_submit" : "delete rules",
                "rules":rules,
                "rulename":rulename,
                "ruleusers":ruleusers
            },
            success:function(data) {          
                rules=[];
				rulename='';
				ruleusers=[];
                //refresh this page
                window.location.reload(true); 
              }
          });                   
    	});    	



	    //cancel dialog
	    $('#confirm3 button.close ').click(function(){
        	emails=[];
        	emailname='';
			emailusers=[];
    	});
    

	    //cancel button
	    $('#confirm3 .modal-footer > a#cancel.btn').click(function(){
 	      	 emails=[];
        	emailname='';
			emailusers=[]; 	      	 
 
    	    $('#confirm3').modal('hide');
    
    	});


   
   	//delete function
    	//trash click
	    $('#emailtosms .icon-trash').click(function(){
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
	            confirm_ets_delete(alt_message);
	        }
	    });


    $('#emailtosms #table-footer-2 > a#emails-delete-selected').click(function(){
	    
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
	
	            confirm_ets_delete(alt_message);
	        }else{  
	            $('#confirm4').modal();
	        }
	
	    });
		
     		//------------ ACCEPT
    	$('#confirm3 .modal-footer > a#accept.btn').click(function(){
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