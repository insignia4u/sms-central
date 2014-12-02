var rules=[];
var rulename='';
var ruleusers=[];

function confirm_delete(alt_message){
	$('#confirm1 .modal-body').html(alt_message);
    $('#confirm1').modal();
 }




$(document).ready(function() {


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
    	
   
   	//delete function
    	//trash click
	    $('.icon-trash').click(function(){
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
	            confirm_delete(alt_message);
	        }
	    });
		

//multiple delete		    
	    $('#table-footer-2 > a#rules-delete-selected').click(function(){
	    
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



});