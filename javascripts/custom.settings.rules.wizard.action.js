function prepare_contacts()
  {
    $('input[name="assign_groups"]').val('');   
  
    var groups = [];

    //now iterate all selected groups
    $('.groups.selected li').each(function() {
    
      //get id
      var id=$(this).attr('id').split('_');
      groups.push(id[1]);
    });

    $('input[name="assign_groups"]').val(groups.join(','));   
  
  }
  
 function render_groups()
 {
	  if($('input[name="assign_groups"]').length)
	  {
	    $.each($('input[name="assign_groups"]').val().split(','),function(i,val) {
	      $('#assigngroup_'+val+' a').click();
	    });
	  }
 }  


function sidebar_fix()
{

	$(".wizard .contentleft").css('height','auto');
	$(".sidebar").css('height','auto');
	
	
     var leftHeight = $(".sidebar").height();
      var rightHeight = $(".wizard .contentleft").height();
      if (leftHeight > rightHeight){ $(".wizard .contentleft").height(leftHeight)}
      else{ $(".sidebar").height(rightHeight - 19)};
}  


function setnumber1(){

    var i = 1;
    $('.contcheck').each(function(){
    
	 if(!$(this).hasClass('dlr'))
	{
      $(this).find('.num').html(i);
      $(this).attr('id','concheck-' + i);
      var j=i-1;
      $(this).find('.checklog input[type="checkbox"]').attr('name','forward_urlauthentication['+j+']');
      i += 1;
    }
    
    });
  }

function setnumber2(){
    var i = 1;
    $('.contcheck.dlr').each(function(){
      $(this).find('.num').html(i);
      $(this).attr('id','concheck-' + i);
      var j=i-1;
      $(this).find('.checklog input[type="checkbox"]').attr('name','forward_dlrurlauthentication['+j+']');
      i += 1;
    });
  }

  
$(document).ready(function() {
 setnumber1();
 setnumber2();

	$('.checklog .custom-checkbox input').die('change');	
	$('.checklog .custom-checkbox input').live('change', function() {
    var container = "#" + $(this).closest("li.contcheck").attr("id");
    if($(container + ' .checklog .custom-checkbox input[type="checkbox"]').is(':checked')) {
      $(container + ' .checkboxlog').show('slow',function(){sidebar_fix()});
    }
    else{
      $(container + ' .checkboxlog').hide('slow',function(){sidebar_fix()});

    }
  })


  
  $('#addScnt').die('click');  
  $('#addScnt').live('click', function() {
    var scntDiv = $('#multifield1');
    var i = $('#multifield li.contcheck').size() + 1;
    var addinput = '<li style="display:none" class="contcheck"><div class="inputnum"><div class="num"></div><input type="text" name="forward_url[]" placeholder="http://www.yourserverurl.here"><a href="#" class="remScnt">remove url</a></div><div class="checklog"><a href="#"  onclick="tooltip.add(this,\'tipauth\'); return false;" class="helpicon">?</a><span class="custom-checkbox"><input type="checkbox" name="forward_urlauthentication[]" value="1"><span class="box"><span class="tick"></span></span><label for="checkbox" class="checkbox">Need Authentication</label></span><div class="checkboxlog"><div class="boxdashed"><div class="inline"><label>Username:</label><input type="text" name="forward_urlusername[]" placeholder="username"></div><div class="inline"><label>Password:</label><input type="password" name="forward_urlpassword[]" placeholder="password"></div></div></div></div><div class="checklog2"> <a href="#"  onclick="tooltip.add(this,\'tipretry\'); return false;" class="helpicon">?</a> <span class="custom-checkbox"><input type="checkbox" name="forward_urlallowretry[]" value="1"><span class="box"><span class="tick"></span></span><label for="checkbox" class="checkbox">Apply Retry Logic</label></span> </div></li>';

    $(addinput).appendTo(scntDiv).slideDown('slow',function(){sidebar_fix()});
	
    setnumber1();

    return false;
  });


  $('#addScnt2').live('click', function() {
  var scntDiv = $('#multifield2');
    var i = $('#multifield li.contcheck').size() + 1;
    var addinput = '<li style="display:none" class="contcheck dlr"><div class="inputnum"><div class="num"></div><input type="text" name="forward_dlrurl[]" placeholder="http://www.yourserverurl.here"><a href="#" class="remScnt">remove url</a></div><div class="checklog"><a href="#"  onclick="tooltip.add(this,\'tipauth\'); return false;" class="helpicon">?</a><span class="custom-checkbox"><input type="checkbox" name="forward_dlrurlauthentication[]" value="1"><span class="box"><span class="tick"></span></span><label for="checkbox" class="checkbox">Need Authentication</label></span><div class="checkboxlog"><div class="boxdashed"><div class="inline"><label>Username:</label><input type="text" name="forward_dlrurlusername[]" placeholder="username"></div><div class="inline"><label>Password:</label><input type="password" name="forward_dlrurlpassword[]" placeholder="password"></div></div></div></div><div class="checklog2"> <a href="#"  onclick="tooltip.add(this,\'tipretry\'); return false;" class="helpicon">?</a> <span class="custom-checkbox"><input type="checkbox" name="forward_dlrurlallowretry[]" value="1"><span class="box"><span class="tick"></span></span><label for="checkbox" class="checkbox">Apply Retry Logic</label></span> </div></li>';

    $(addinput).appendTo(scntDiv).slideDown('slow',function(){sidebar_fix()});

    setnumber2();

    return false;
  });



  $('.remScnt').die('click');
  $('.remScnt').live('click', function() { 
    if( $('#multifield1 li.contcheck').size() >= 2 ) {
      $(this).parents('li.contcheck').slideUp('fast', function() {
       var isdlr = $(this).hasClass('dlr');
        $(this).remove();
		sidebar_fix();       
     
     	if(isdlr)
     	{
        	setnumber2();
      	}
      	else
      	{
        	setnumber1();      	
      	}
      });
    }


    if( $('#multifield2 li.contcheck').size() >= 2 ) {
      $(this).parents('li.contcheck').slideUp('fast', function() {
       var isdlr = $(this).hasClass('dlr');
        $(this).remove();
       
     	sidebar_fix();       
     	if(isdlr)
     	{
        	setnumber2();
      	}
      	else
      	{
        	setnumber1();      	
      	}
      });
    }

    return false;
  });



	//init
	
	if($('#check-01 #action_url').is(':checked')) $('#check-01 #url_contcheck').show();
	if($('#check-02 #action_email').is(':checked')) $('#check-02 #email_contcheck').show(); 
	if($('#check-07 #action_autoreply').is(':checked')) $('#check-07 #autoreply_contcheck').show(); 	
	if($('#check-05 #action_assigncontact').is(':checked')) $('#check-05 #assigncontact_contcheck').show(); 
	if($('#check-10 #action_dlrurl').is(':checked')) $('#check-10 #dlrurl_contcheck').show();		
	if($('#check-11 #action_dlremail').is(':checked')) $('#check-11 #email_dlrcontcheck').show(); 	
	if($('#check-12 #action_mobile').is(':checked')) $('#check-12 #mobile_contcheck').show(); 
	if($('#check-13 #action_senderoverwrite').is(':checked')) $('#check-13 #senderoverwritecontcheck').show(); 
	render_groups();
	
	


  $('.listchecks .checkinput').unbind('change');
  $('.listchecks .checkinput').on('change', function() {
    var container = "#" + $(this).closest("li.licheck").attr("id");
    if($(container + ' .checkinput').is(':checked')) {
      $(container + ' .contentcheck').show('slow',function(){	sidebar_fix()})
    }
    else{
      $(container + ' .contentcheck').hide('slow',function(){	sidebar_fix()})
    }
  })
	
 $('#selectcallback2').selectmenu({
      style:'dropdown',
      change: function () { 
        $(".selectswitch").slideDown();
       } 
    });


	$('#check-13 .selectiveradio').on('change', function(){

		var id=$(this).attr('id').split('_');
		$('.selectivetemplate').slideUp();
		$('#selectivetemplate_'+id[1]).slideDown();

	    if($('input[name="from"]:checked').val()==2)
		{
			$('#selectivetemplate_1').show();
		}
		else if($('input[name="from"]:checked').val()==3)
		{
			$('#selectivetemplate_2').show();
		}
		else
		{
			$('#selectivetemplate_1').hide();
			$('#selectivetemplate_2').hide();
		}
	});
	
	



	if($('input[name="from"]:checked').val()==2)
	{
		$('#selectivetemplate_1').show();
	}
	else if($('input[name="from"]:checked').val()==3)
	{
		$('#selectivetemplate_2').show();
	}
	else
	{
		$('#selectivetemplate_1').hide();
		$('#selectivetemplate_2').hide();
	}




	
	
	$(document).on("change", function(){
		sidebar_fix();
	});
	
	$(".wizard .contentleft").css('height','auto');
	$(".sidebar").css('height','auto');
     var leftHeight = $(".sidebar").height();
      var rightHeight = $(".wizard .contentleft").height();
	if($('input[name="when"]').length>0)
	{
      if (leftHeight > rightHeight){ $(".wizard .contentleft").height(leftHeight)}
      else{ $(".sidebar").height(rightHeight - 29)};
     }
     else
     {
      if (leftHeight > rightHeight){ $(".wizard .contentleft").height(leftHeight)}
      else{ $(".sidebar").height(rightHeight - 25)};
      } 	
});
