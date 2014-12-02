$(document).ready(function() {
	$(document).unbind('ajaxStart');

	

	var jVal = {
		'group_name' : function (){
			var nameInfo = $('#nameInfo');
            if (nameInfo.length <= 0) {
                $('body').append('<div id="nameInfo" class="validate-info"></div>');
                nameInfo = $('#nameInfo');
            }
			var ele = $('input[name="group_name"]');
			var pos = ele.offset();

			nameInfo.css({
		      top: pos.top,
		      left: pos.left+ele.width()+67
		    });

            var group_name = (ele.attr('placeholder') && ele.attr('placeholder') == ele.val())? '' : ele.val();

		    $.ajax({
				type: "POST",
				url: '/contacts/validategroupname_ajax',
				async: false,
				data:{ 
	                "group_name": group_name
	            },
	            success:function(data) {      
                    jVal.group_name_processed = true;
	            	data = JSON.parse(data);       
	            
	            	if (data.result == false){
	            		jVal.errors = true;
	            		nameInfo.removeClass('validate-correct').addClass('validate-error').html('<span class="validation-arrow"></span> '+data.message).fadeIn();
	            		ele.removeClass('normal').addClass('wrong');
		       			ele.closest('.control-group').removeClass('success');
		        		ele.closest('.control-group').addClass('error')
                        jVal.showErrorNotification(data.message);
	            	}else{
	            		nameInfo.removeClass('validate-error').addClass('validate-correct').html('<div class="icon-ok"></div>').fadeIn();
		        		ele.removeClass('wrong').addClass('normal');
		        		ele.closest('.control-group').addClass('success');
		        		ele.closest('.control-group').removeClass('error')
                        jVal.showErrorNotification('');
	            	}
				}
			});

		},
		'group_alias' : function (){
			var nameInfo = $('#aliasInfo');
            if (nameInfo.length <= 0) {
                $('body').append('<div id="aliasInfo" class="validate-info"></div>');
                nameInfo = $('#aliasInfo');
            }
    		var ele = $('input[name="group_alias"]');
    		var pos = ele.offset();

    		nameInfo.css({
		      top: pos.top,
		      left: pos.left+ele.width()+67
		    });

            var group_alias = (ele.attr('placeholder') && ele.attr('placeholder') == ele.val())? '' : ele.val();

		    $.ajax({
				type: "POST",
				url: '/contacts/validatealias_ajax',
				async: false,
				data:{ 
	                "group_alias": group_alias
	            },
	            success:function(data) {      
                    jVal.group_alias_processed = true;
	            	data = JSON.parse(data);       
	            
	            	if (data.result == false){
	            		jVal.errors = true;
	            		
	            		nameInfo.removeClass('validate-correct').addClass('validate-error').html('<span class="validation-arrow"></span> '+data.message).fadeIn();
	            		ele.removeClass('normal').addClass('wrong');
		       			ele.closest('.control-group').removeClass('success');
		        		ele.closest('.control-group').addClass('error');
                        jVal.showErrorNotification(data.message);
	            	}else{
	            		nameInfo.removeClass('validate-error').addClass('validate-correct').html('<div class="icon-ok"></div>').fadeIn();
		        		ele.removeClass('wrong').addClass('normal');
		        		ele.closest('.control-group').addClass('success');
		        		ele.closest('.control-group').removeClass('error')
                        jVal.showErrorNotification('');
	            	}
				}
			});

		    
		},
		'sendIt' : function (el){
			if(!jVal.errors) {
      			$('form').submit();
    		}else{
		    	$(el).button('reset')
    		}
		},
        'showErrorNotification': function (msg) {
            if (msg != '') jVal.previous_msg = msg;
            if (!(jVal.group_name_processed && jVal.group_alias_processed) || jVal.previous_msg == '') return;
            msg = jVal.previous_msg;
            if (jVal.group_name_processed && jVal.group_alias_processed && $('input[name="group_name"]').hasClass('wrong') && $('input[name="group_alias"]').hasClass('wrong')) msg = 'The group cannot be created due to errors below:';
            var top_page_error_notification = $('#top_page_error_notification');
            if (top_page_error_notification.length == 0) {
                $('body').prepend(function(){ return '<div id="top_page_error_notification"/>'; });
            }
            top_page_error_notification = $('#top_page_error_notification');
            var html = '<div class="alert alert-error"><button class="close" data-dismiss="alert">x</button><i class="icon-exclamation-white"></i>'+msg+'</div>';
            top_page_error_notification.html(html);
        }
	};

	//$('input[name="group_name"]').change(jVal.group_name);
	//$('input[name="group_alias"]').change(jVal.group_alias);

	$('input[name=group_name]').keyup(function(){
    	keyupval = $(this).val();
    	assumed_alias = keyupval.replace(/[^\w]/gi, '');
    	assumed_alias = assumed_alias.replace( /_/g, '');
    	
    	
    	$('input[name=group_alias]').val(assumed_alias); 
	});

	$('#cancelgroup').click(function(e){
		window.location = '/contacts';
		e.preventDefault();
	});

	$('#savegroup').click(function(e){
		$('#saveandaddanothergroup').val(0);
		
		$(this).button('loading');
	
		var obj = $.browser.webkit ? $('body') : $('html');
		obj.animate({ scrollTop: $('form').offset().top }, 750, function (){
		    jVal.errors = false;
            jVal.previous_msg = '';
            jVal.group_name_processed = false;
            jVal.group_alias_processed = false;
		    jVal.group_name();
			jVal.group_alias();
            var _savegroup_int = setInterval(function(){
                if (jVal.group_name_processed && jVal.group_alias_processed) {
                    clearInterval(_savegroup_int);
                    jVal.sendIt($('#savegroup'));
                }
            }, 1000);
		   
		});

		e.preventDefault();
	});

	$('#saveandaddgroup').click(function(e){
		$('#saveandaddanothergroup').val(1);

		$(this).button('loading');

		var obj = $.browser.webkit ? $('body') : $('html');
		obj.animate({ scrollTop: $('form').offset().top }, 750, function (){
		    jVal.errors = false;
            jVal.previous_msg = '';
            jVal.group_name_processed = false;
            jVal.group_alias_processed = false;
		    jVal.group_name();
			jVal.group_alias();
            var _saveandaddgroup_int = setInterval(function(){
                if (jVal.group_name_processed && jVal.group_alias_processed) {
                    clearInterval(_saveandaddgroup_int);
                    jVal.sendIt($('#saveandaddgroup'));
                }
            }, 1000);
		   
		});
		e.preventDefault();
	});
});
