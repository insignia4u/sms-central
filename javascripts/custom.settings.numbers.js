var numberids=[];
var buy_numberids=[];

function confirm_cancel(alt_message){
	$('#confirm_cancel .modal-body').html(alt_message);
    $('#confirm_cancel').modal();
}

$(document).ready(function() {
	$('.icon-trash').tooltip();	

    $('#confirm_cancel button.close ').click(function(){
    	rules=[];
	});


    //cancel button
    $('#confirm_cancel .modal-footer > a#cancel.btn').click(function(){
	      	 rules=[];

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

	$('.table-footer-2 > a#numbers-cancel-selected').click(function(){
	    
	    	//reset the arrays
	    	numberids=[];

	        
	        //get all the checkbox that are checked
		     $(this).parents('.table-box ').find('.custom-checkbox input:checked').each(function() {
		     	numberids.push($(this).val());

		     });
			
			var from = '';
	        if(numberids.length>0){
	            if(numberids.length > 1){
					var ids = {};
					for (var i = 0; i < numberids.length; i++)
					{
						var acct_id = $('#numbers_acct_id_'+numberids[i]);
						if (acct_id.length > 0) ids[acct_id.val()] = acct_id.val();
					}
					var ctr = 0;
					for (var i in ids) ctr++;
					if (ctr > 0)
					{
						from = ' from ' + ctr + ' account';
						if (ctr > 1) from += 's';
					}
					var num_label = (numberids.length > 1)? 'numbers' : 'number';
	                alt_message = "You are about to cancel "+numberids.length +" "+num_label+from+". ";
	            }else{
	                number =  $(this).parents('.table-box ').find('.custom-checkbox input:checked').parent().parent().prev().prev().prev().prev().prev().html();
	                number = number.replace(/<[^>]*>/,"");
	                number = number.replace(/(<.*>)/,"");
					var acct_name = $('#numbers_acct_name_'+numberids[0]);
					if (acct_name.length > 0) from = " from '"+acct_name.html()+"'";
	
	                alt_message = "You are about to cancel the number '"+number+"'"+from+". ";
	               
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

    $('.btn.btn-small.btn-success.buynumbers').click(function(){
    	// reset arrays
    	buy_numberids=[];
    	$('#available.table-box').find('.custom-checkbox input:checked').each(function() {
			buy_numberids.push($(this).val());
    	});

    	if(buy_numberids.length>0){
			$('#form_buynumbers input[name="buy_numberids"]').val(buy_numberids.join(','));
            $('#form_buynumbers').submit();
		}else{
            $('#confirm_buy_failed').modal();
        }

		
    });

    $('.table-footer-2 > a.buynumbers').click(function(){
    	// reset arrays
    	buy_numberids=[];
    	//get all the checkbox that are checked
	    $(this).parents('.table-box ').find('.custom-checkbox input:checked').each(function() {
			buy_numberids.push($(this).val());
		});
	    
		if(buy_numberids.length>0){
			$('#form_buynumbers input[name="buy_numberids"]').val(buy_numberids.join(','));
            $('#form_buynumbers').submit();
		}else{
            $('#confirm_buy_failed').modal();
        }

		

    });


	$('#numbers table .custom-checkbox input[type="checkbox"]').on('change', function() {
		table_footer_showhide('numbers');
	});

	$('#available table .custom-checkbox input[type="checkbox"]').on('change', function() {
		table_footer_showhide('available');
	});

    table_footer_showhide('numbers');
    table_footer_showhide('available');

    $('.numphone a').die();

    $('.numphone a').click(function(e){
        e.preventDefault();
    });
        
    $('.credit .icon-trash').click(function(){
        
        delete_item_id = $(this).next('input').val();
        delete_item_id = parseInt(delete_item_id);
        numberids_cart.splice( $.inArray(delete_item_id, numberids_cart), 1 );
        
        $.ajax({
            type: "POST",
            url: '/settings/numbers/compute_buy_numbercharge',
            data:{ 
                "buy_numberids":numberids_cart
            },
            success:function(data) {      
                data = JSON.parse(data);    
                if (data.total_setup != undefined){
                    $('.ticket .billcontact').next('strong').html('$'+data.total_setup);
                }

                if (data.total_rental != undefined){
                    $('.ticket .total strong').html('$'+data.total_rental);
                }

                if (data.total_cost != undefined){
                    $('.ticket .payment strong').html('$'+data.total_cost);
                }
              }
          }); 

        var container = "." + $(this).closest(".credit").slideUp();

        return false;      
    });

    $('.buymore').click(function(){
        //data-toggle="modal"
        $.ajax({
            type: "POST",
            url: '/settings/numbers/get_availablenumbers',
            data:{ 
                "numbersincart":numberids_cart
            },
            success:function(data) {  
                data = JSON.parse(data);        
                
                html = '';
                if (data.availablelongcodes != undefined){
                    c = 1;
                    $.each(data.availablelongcodes, function(index, availablelongcode) { 
                        html += '<tr class="item-'+c+' item">';
                        html += '<td><a href="#">+'+availablelongcode.longcode+'</a></td>';
                        html += '<td>'+availablelongcode.longcodeclassname+'</td>';
                        
                        html += '<td>$';

                        if (availablelongcode.gstsetting != null)
                            gstsetting = availablelongcode.gstsetting;
                        else
                            gstsetting = availablelongcode.defaultgstsetting;

                        if (availablelongcode.setupcost != null){
                            html += availablelongcode.setupcost;
                            if (gstsetting == 1)
                                html += ' excl. GST';
                            else
                                html += ' incl. GST';
                        }else{
                            html += availablelongcode.defaultsetupcost;
                            if (gstsetting == 1)
                                html += ' excl. GST';
                            else
                                html += ' incl. GST';
                        }
                        html += '</td>';

                        html += '<td>$';
                        if (availablelongcode.monthlyrental != null){
                            html += availablelongcode.monthlyrental;
                            if (gstsetting == 1)
                                html += ' excl. GST';
                            else
                                html += ' incl. GST';
                        }else{
                            html += availablelongcode.defaultmonthlyrental;
                            if (gstsetting == 1)
                                html += ' excl. GST';
                            else
                                html += ' incl. GST';
                        }
                        html += '</td>';

                        html += '<td></td>';
                            html += '<td><span class="custom-checkbox"><input type="checkbox" id="checkbox-longcodes-'+c+'" class="checkbox-'+c+'" value="'+availablelongcode.id+'" ><span class="box"><span class="tick"></span></span></span></td><td class="last"></td>';

                        html += '</tr>'; 
                        c++;
            });
          }
          $.getScript("/javascripts/table.js", function(data, textStatus, jqxhr) {
            $('#modal table .custom-checkbox input[type="checkbox"]').on('change', function() {
            table_footer_showhide('modal');
            });
          });
        
          $('#modal .btn.btn-small.btn-success.buynumbers').unbind();
          $('#modal .btn.btn-small.btn-success.buynumbers').click(function(){
                    // reset arrays
          buy_numberids=[];
          $('#modal .table-box').find('.custom-checkbox input:checked').each(function() {
            buy_numberids.push($(this).val());
          });

          if(numberids_cart.length>0)
            buy_numberids = $.merge( numberids_cart, buy_numberids );

          if(buy_numberids.length>0){
            $('#form_buynumbers input[name="buy_numberids"]').val(buy_numberids.join(','));
          }
            if($('#modal .table-box').find('.custom-checkbox input:checked').length > 0){
                $('#form_buynumbers').submit();
            } else{
                $('#confirm_payment_failed').modal();
            }
        
          

          });

          $('#modal .table-footer-2 > a.buynumbers').unbind();
          $('#modal .table-footer-2 > a.buynumbers').click(function(){
            // reset arrays
            buy_numberids=[];
            //get all the checkbox that are checked
            $(this).parents('.table-box ').find('.custom-checkbox input:checked').each(function() {
              buy_numberids.push($(this).val());
            });

            if(numberids_cart.length>0)
              buy_numberids = $.merge( numberids_cart, buy_numberids );
                    
            if(buy_numberids.length>0){
              $('#form_buynumbers input[name="buy_numberids"]').val(buy_numberids.join(','));
            }
          
            $('#form_buynumbers').submit();

          });
                
          $('.select-available table tbody').html(html);  
          $('#modal').modal();


          table_footer_showhide('modal');
        }
    });

        
   });

    $('.btn.btn-success.confirm_payment').click(function(){
       

        var payment_modal = 'postpaid';
        var is_free = false;
        if ($('.btn.btn-success.confirm_payment').hasClass('prepaid'))
            payment_modal = 'prepaid';

        if ($('.btn.btn-success.confirm_payment').hasClass('free'))
            is_free = true;

        if (numberids_cart.length > 0){
            if (payment_modal == 'postpaid'){
                $.ajax({
                    type: "POST",
                    url: '/settings/numbers/confirm_payment',
                    data:{ 
                        "paymentmodel":payment_modal,
                        "numbersincart":numberids_cart
                    },
                    success:function(data) {          
                        numberids_cart=[];

                        //refresh this page
                        window.location = '/settings/numbers';
                    }
                }); 
            }

            if (payment_modal == 'prepaid'){
                var form = $('form.billing');
                var creditcard_number = '';
                var cc_loc = ["cc-01", "cc-02","cc-03","cc-04"];

                $.each(cc_loc, function(idx, id_desc) { 
                    creditcard_number += $('form.billing .input-mini#'+id_desc).val()+"";
                });

                $.ajax({
                    type: "POST",
                    url: '/settings/numbers/confirm_payment',
                    data:{ 
                        "paymentmodel":payment_modal,
                        "numbersincart":numberids_cart,
                        "creditcard_number":creditcard_number,
                        "cardholdername": $('form.billing #cc-06').val(),
                        "expirymonth": $('form.billing #date01').val(),
                        "expiryyear": $('form.billing #date02').val(),
                        "type": $('form.billing .custom-radio input[name=radiocard]:checked').val(),
                        "cvn": $('form.billing .input-mini#cc-05').val(),
                        "is_free": is_free
                    },
                    success:function(data) {          
                        data=$.parseJSON(data);
                        $('html, body').animate({scrollTop:0}, 'fast');

                        if(data['error'] == ''){
                            numberids_cart=[];
                            $('.alert.alert-error').remove();
                            window.location = '/settings/numbers';
                        }else{
                            $('.alert.alert-error').remove();
                            prepend_alert = '<div class="alert alert-error">/div>';
                            $('body').prepend(prepend_alert);
                            $('.alert.alert-error').html('<button class="close" data-dismiss="alert">x</button><i class="icon-exclamation-white"></i>'+data['error']);
                        }
                       // numberids_cart=[];
                            /*
                        $('.alert.alert-error').remove();
                    prepend_alert = '<div class="alert alert-error">/div>';
                        $('body').prepend(prepend_alert);
                    $('.alert.alert-error').html('<button class="close" data-dismiss="alert">x</button><i class="icon-exclamation-white"></i>'+responseJSON.message);
                        */
                        //refresh this page
                       // window.location = '/settings/numbers';
                    }
                }); 
                
            

                
            }
        }else{
            $('#confirm_payment_failed').modal();  
        }
        
    });

    
});


function table_footer_showhide(parent){
	count_checked_numbers = $('#'+parent+' table .custom-checkbox input[type="checkbox"]:checked').length;
    if (count_checked_numbers > 0){
        $('#'+parent+' .table-footer-2').show();
        $('#'+parent+' .table-footer-1').hide();

        $('#'+parent+' table .custom-checkbox input[type="checkbox"]:checked').each(function(){
        	$(this).parent().parent().parent().addClass('selected');
        })
    }else{
        $('#'+parent+' .table-footer-1').show();
        $('#'+parent+' .table-footer-2').hide();
    }
}


function show_share_modal(option)
{
    var numbers = $('#numbers').find('.custom-checkbox input:checked').filter(':visible');
    shared = 0;
    unshared = 0;
    numbers.each(function(){
        if($(this).parent().parent().parent().first().find('i').length > 0) {
            shared++;
        } else {
            unshared++;
        }
    });
    if(option == 'share') {
        $('#shareLabel').html('Share with subaccounts');
        $('#shared_count').html('share '+unshared+' selected numbers with your subaccounts.');
        $('#accept_share span').html('Share');
    } else if(option == 'unshare') {
        $('#shareLabel').html('Unshare with subaccounts');
        $('#shared_count').html('unshare the '+shared+' selected shared numbers.');
        $('#accept_share span').html('Unshare');
    }
    $('#share_modal').modal();
}

// show hide share and unshare option in table footer
    $('#numbers .custom-checkbox input[type="checkbox"]').on('change', function() {
        var numbers = $('#numbers').find('.custom-checkbox input:checked').filter(':visible');
        shared = 0;
        unshared = 0;
        numbers.each(function(){
            if($(this).parent().parent().parent().first().find('i').length > 0) {
                shared++;
            } else {
                unshared++;
            }
        });
        if(shared > 0) {
            $('#numbers-unshare-selected').parent().show();
        } else {
            $('#numbers-unshare-selected').parent().hide();
        }

        if(unshared > 0) {
            $('#numbers-share-selected').parent().show();
        } else {
            $('#numbers-share-selected').parent().hide();
        }
    });
    

$('#numbers-share-selected').bind('click', function(){
        show_share_modal('share');
    });
    $('#numbers-unshare-selected').bind('click', function(){
                show_share_modal('unshare');
        });

// cancel button
$('#share_modal .modal-footer > a#cancel_share.btn').unbind('click').bind('click', function(){
    $('#share_modal').modal('hide');
});

// share numbers button
$('#share_modal .modal-footer > a#accept_share.btn').unbind('click').bind('click', function(){
    var numbers = $('#numbers').find('.custom-checkbox input:checked').filter(':visible');
    option = $('#accept_share span').html() == 'Share' ? 1 : 0;
    var longcodes = {};
    numbers.each(function(){
        var id = $(this).val();
        var acct_id = $('#acct_id_'+id);
        if (acct_id.length > 0) acct_id = acct_id.val();
        longcodes[id] = acct_id;
    });
    
    if (numbers.length <= 0)
    {
        show_top_notification('No number selected');
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/settings/share_numbers_ajax',
        dataType: 'json',
        data: {
            'enabled' : option,
            'longcodes': longcodes
        },
        success:function(data) {
            $('#share_modal').modal('hide');
            if (typeof(data.error) != 'undefined')
            {
                show_top_notification(data.error);
                return;
            }
            if (typeof(data.message) != 'undefined')
            {
                show_top_notification(data.message, 'success');
                setTimeout(function(){
                    window.location.reload(true);
                }, 3000);
            }
        }
    });
});

// note: to support IE (anger rising as I type)
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

