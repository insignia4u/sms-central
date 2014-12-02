	function check_all_specific()
	{
	
		if($('#contacts_count').val()>0)
		{
			 if($('input[name="recipients_specific"]:checked').val()==1)
			 {
				$('#check-02 .contentcheck').show();
				$('input[name="recipients_all"]').removeAttr('checked');		 		 
				$('input[name="recipients_all"]').attr('disabled',true);		 		 
			 $('#label_all').addClass('gray');
			 }
			 else
			 {
				$('input[name="recipients_all"]').removeAttr('disabled');	
				 $('#label_all').removeClass('gray');		 
			 }
			 
			 if($('input[name="recipients_all"]:checked').val()==1)
			 {
				$('#check-02 .contentcheck').hide();		 
				$('input[name="recipients_specific"]').removeAttr('checked');		 		 
				$('input[name="recipients_specific"]').attr('disabled',true);			 
			 $('#label_specific').addClass('gray');
			 }		 
			 else
			 {
				$('input[name="recipients_specific"]').removeAttr('disabled');			 
			 $('#label_specific').removeClass('gray');
			 }
		}
		else
		{
			 $('input[name="recipients_all"]').removeAttr('checked');
			 $('input[name="recipients_all"]').attr('disabled',true);		 		 
			 $('#label_all').addClass('gray');
			 $('input[name="recipients_specific"]').removeAttr('checked');	
			 $('input[name="recipients_specific"]').attr('disabled',true);			 
			 $('#label_specific').addClass('gray');
		
		}	

	}


		

	
	
	

    $(document).ready(function() {

	  $('#newtemplate .selectiveradio').on('change', function() {
			//get the id
			var id=$(this).attr('id').split('_');
			
		      $('.selectivetemplate').slideUp();
		      $('#selectivetemplate_'+id[1]).slideDown();

	      var leftHeight = $(".sidebar").height();
	      var rightHeight = $(".wizard .contentleft").height();
	      if (leftHeight > rightHeight){ $(".wizard .contentleft").height(leftHeight)}
	        else{ $(".sidebar").height(rightHeight - 19)};
	  });
		    

	$('input[name="recent"]').change(function(){
	   //get id
	    var id=$(this).attr('id').split('_')
		//get the selected 
		var index= $.inArray(id[1]+'',$('#select2').select2('val'));
		 if($(this).is(':checked'))
		  {
		  		if(index==-1)
		  	{
				var arr=$('#select2').select2('val');
				arr.push(id[1]);	  	
				$('#select2').select2('val',arr);
		  	}
		  }
		  else
		  {
			if(index!=-1)
			{	  
				var arr=$('#select2').select2('val');
				arr.splice(index,1);
		 		$('#select2').select2('val',arr);
		 	}
		  }
	});
	
	
			
		

	 if($('input[name="newcontact"]:checked').val()==2)
	 {
	 	$('#selectivetemplate_2').show();
	 }
	 else if($('input[name="newcontact"]:checked').val()==1)
	 {
	 	$('#selectivetemplate_1').show();
	 }



	//init
		 if($('input[name="recipients_specific"]:checked').val()==1)
		 {
		 	$('#check-02 .contentcheck').show();
		 	
		 }

		 if($('input[name="recipients_new"]:checked').val()==1)
		 {
		 	$('#check-03 .contentcheck').show();
		 	
		 }		 

		check_all_specific();		 


		$("#select2").change(function(e) {
		
			if(typeof(e.removed)!='undefined')
			{	
				$('#recent_'+e.removed.id).removeAttr('checked');
				$('#recent_'+e.removed.id).change();
			}
			
			if(typeof(e.added) !='undefined')
			{
				$('#recent_'+e.added.id).attr('checked',true);	
				$('#recent_'+e.added.id).change();
			}
		 });
		 
			
		var a=$('#select2').val();
	
		if(a!=null)
		{
		$.each(a, function(index,val) {
	
			$('#recent_'+val).attr('checked',true);	
			$('#recent_'+val).change();
		
		});
		}	 


/*
	  if($('.multiple-tabs-auto #textareatags3').length){
	    $('.multiple-tabs-auto #textareatags3').tagsInput({
	      width:'auto',
	      defaultText:'',
		  autocomplete_url:'/campaigns/autocomplete2',
	  		autocomplete:{useCache:false, selectFirst:true,width:'100px',autoFill:true,minChars:3,filterResults:false}
	    });
	  }
*/

	  if($('.multiple-tabs-auto #textareatags3').length){
	    $('.multiple-tabs-auto #textareatags3').tagsInput({
	      width:'auto',
	      defaultText:''
	    });
	  }



	});
