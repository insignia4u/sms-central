$(function(){

  _menu = $('.ff-container').clone();
  _parent = $('.ff-container').parent();

  $('.ff-container').remove();
  _parent.append(_menu);

  $('.ff-container input[type="radio"]').on('change', function() {
    $('.ff-container li').removeClass('active');
    $(this).closest('li').addClass('active');
    var checkboxID = $(this).attr('class').split('-');
    checkboxID = checkboxID[checkboxID.length-1];
    var itemID = '.ff-item-type-' + checkboxID
    
    if($(this).val().length > 2) {
    	window.location.href = $(this).val();
    } else {
    	if($('.ff-container input').is(':checked')) {
    		$('.ff-items li').hide();
    	}
    	
    	if($(this).is(':checked')) {
    		if(itemID == '.ff-item-type-all'){
    			$('.ff-items li').show();
    		}else{
    			$(itemID).show();
    		}
    	}

    	$('#report h2').html($('label.ff-label-type-' + checkboxID).text());
    }
  });
});

var parent_tree = '';
var user_list = '';

function load_parent_tree(){
	$('#parent_tree_loading').show();
	var include_parent = false;
	if($('#log_accounts').data('report-type') != 'activity'){
		include_parent = true;
	}
	$.ajax({
		dataType: 'json',
		cache: false,
		url: '/account/get_parent_tree_ajax/',
		type: 'POST',
		data: {'include_parent': include_parent},
		success: function(msg){
			$('#parent_tree_loading').hide();
			parent_tree = msg;
			$("#log_accounts").select2('enable',true);
			$("#log_accounts").removeAttr('disabled');
			if(typeof(accounts) != 'undefined'){
				$("#log_accounts").select2('val',accounts);
			}
			else{
				var account = [$('#log_accounts').val()];
				$("#log_accounts").select2('val',account);
			}
		}
	});
}

function load_user_list(){
	$('#user_list_loading').show();
	$.ajax({
		dataType: 'json',
		cache: false,
		url: '/reports/get_campaign_users/',
		success: function(msg){
			$('#user_list_loading').css('background','none');
			user_list = msg;
			$("#log_users2").select2('enable',true);
			$("#log_users2").removeAttr('disabled');
			if(typeof(users) != 'undefined'){
				$("#log_users2").select2('val',users);
			}
			else{
				var users = [$('#log_users2').val()];
				$("#log_users2").select2('val',users);
			}
		}
	});
}

// load accounts list if filter field exist
if($("#log_accounts").length > 0){
	load_parent_tree();
}
// load user list if filter field exist
if($("#log_users2").length > 0){
	load_user_list();
}

function dataFormatResult(data) {
    var markup = "<table class='movie-result'><tr>";
   
    markup += "<td class='data-info'><div class='data-title'>" + data.name + "</div>";
 
    markup += "</td></tr></table>"
    return markup;
}

function dataFormatSelection(data) {
	if(typeof(data) != 'undefined'){
		return data.name;
	}
}

//VIEW ALL ACCOUNTS
$('#view_all_accounts').click(function() {
	if(g_new_window_va_account == null || g_new_window_va_account.closed)
	{

		g_new_window_va_account = window.open(g_user_view_all_account_url,'view_alladminaccounts','location=0,scrollbars=1,resizable=1,height=700,width=780');
	}
	if (window.focus) {g_new_window_va_account.focus()}	
});

$('#log_type').on('change', function(){
	if($(this).val() == 0){
		$('.filter-by-groupby').show();
	}
	else{
		$('.filter-by-groupby').hide();
	}
});

$('#log_type').trigger('change');

$('#log_direction').on('change', function(){
	if($(this).val() == 1){
		$('.filter-by-status').hide();
	}
	else{
		$('.filter-by-status').show();
	}
});

$('#log_direction').trigger('change');

$(document).ready(function(){
	
    $('.log-footer').unbind('click');

    $('.log-footer a.clear').unbind('click');
    $('.log-footer a.clear').click(function(e){
        e.preventDefault()
        window.location = '/reports/resetmessagelog';

    });

    // Toggle Filters
    $('.log-footer a.display_filter').on('click', function (ev) {
        ev.preventDefault();
        var $el = $(this);

        if ($el.hasClass('closed')) {
            $el.html('Open Filters');
        } else {
            $el.html('Close Filters');
        }
        $el.append('<i class="icon-add"></i>');

        $(this).toggleClass('closed');
        $('.inner-filter .log-filter').slideToggle();
    });

	$("#log_accounts").select2({
		initSelection: function( element, callback ){
			var accounts = element.val().split(',');
			var data = [];
			$.each(parent_tree, function(index,tree_item){
				if($.inArray(tree_item.id.toString(),accounts) > -1){
					data.push({id: this.id, name: this.name});
				}
			});
			if($("#log_accounts").prop('multiple')){
				callback(data);
			}
			else{
				callback(data[0]);
			}
		},
		multiple: $("#log_accounts").prop('multiple'),
		query: function(query){
			var data = {results:[]};
			var resultsize = 20, i=0;
			data.results = $.map(parent_tree, function(tree_item, idx){
				if(tree_item.name.toLowerCase().indexOf(query.term.toLowerCase()) !== -1 && i<resultsize && tree_item.id >= 4){
					i++;
					return {id:tree_item.id, name:tree_item.name};
				}
			});
			query.callback(data);
		},
    	formatResult: dataFormatResult, // omitted for brevity, see the source of this page
    	formatSelection: dataFormatSelection // omitted for brevity, see the source of this page
	});
	
	$("#log_users2").select2({
		initSelection: function( element, callback ){
			var users = element.val().split(',');
			var data = [];
			$.each(user_list, function(index,user_list_item){
				if($.inArray(user_list_item.id.toString(),users) > -1){
					data.push({id: this.id, name: this.name});
				}
			});
			if($("#log_users2").prop('multiple')){
				callback(data);
			}
			else{
				callback(data[0]);
			}
		},
		multiple: $("#log_users2").prop('multiple'),
		query: function(query){
			var data = {results:[]};
			var resultsize = 20, i=0;
			data.results = $.map(user_list, function(user_list_item, idx){
				if(user_list_item.name.toLowerCase().indexOf(query.term.toLowerCase()) !== -1 && i<resultsize && user_list_item.id >= 4){
					i++;
					return {id:user_list_item.id, name:user_list_item.name};
				}
			});
			query.callback(data);
		},
    	formatResult: dataFormatResult, // omitted for brevity, see the source of this page
    	formatSelection: dataFormatSelection, // omitted for brevity, see the source of this page
	});
	
	$("#log_campaigns2").select2({
        initSelection: function(element, callback) {
            return $.ajax({
                url: '/reports/get_campaigns_autocomplete',
                dataType: 'json',
                data: {ids: element.val()},
                success: function(data){
                    callback(data);
                }
            });
        },
    	multiple:true,
    	ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
    		url: "/reports/get_campaigns_autocomplete",
    		data: function (term, page) {
    			return {
    				search: term, // search term
    				limit: 10
    			};
    		},
    		results: function (data, page) { // parse the results into the format expected by Select2.
    			// since we are using custom formatting functions we do not need to alter remote JSON data
    			data =  jQuery.parseJSON(data);
    			return {results: data};
    		}
    	},
    	formatResult: dataFormatResult, // omitted for brevity, see the source of this page
    	formatSelection: dataFormatSelection, // omitted for brevity, see the source of this page
    	dropdownCssClass: "bigdrop" // apply css that makes the dropdown taller
    });

    

	$("#message-log").removeAttr('style');
	$('#date_from, #date_to').datepicker({
		format: 'dd/mm/yyyy',
		weekStart: 1
	});
	$('.selectpageelement').selectmenu({style:'dropdown', menuWidth:130});
	$('select.selectpageelement').change(function(){
		window.location = $(this).val();
	});
	
	$('#shedule-report-modal .modal-footer > a.schedule-add, #email-report-modal .modal-footer > a.schedule-add').click(function(event) {
		event.preventDefault();
		var thisobj = $(this).parent();
		var values = {};
		var parent = $(this).closest('div.modal').attr('id');
        //console.log('#'+parent+' :input');
        thisobj.siblings('div.modal-body').find('.alert').remove();
	
        modal_input = $('#'+parent+' :input');
        $.each(modal_input, function(i, field) {
            values[$(field).attr('name')] = $(field).val();
        });
		$.ajax({
			type: "POST",
			url: baseurl+'reports/scheduleAdd',
			data : values,
			success:function(data) {
				data = $.parseJSON(data);
				if(parseInt(data.responsecode) == 0) {
					thisobj.siblings('div.modal-body').append($('#error-notice').html());
					thisobj.siblings('div.modal-body').find('.alert span').html(data.message);
				} else {
					//refresh this page
					window.location.href = baseurl+'reports/messagelog';
				}
			}
		});
	});
    
    $('#email-transaction-report-modal .modal-footer > a.schedule-add').click(function(event) {
		event.preventDefault();
		var thisobj = $(this).parent();
		var values = {};
		var parent = $(this).closest('div.modal').attr('id');
        
        thisobj.siblings('div.modal-body').find('.alert').remove();
	
        modal_input = $('#'+parent+' :input');
        $.each(modal_input, function(i, field) {
            values[$(field).attr('name')] = $(field).val();
        });
        
        values['datefrom'] = $('#dp2').val();
        values['timefrom'] = '00:00:00';
        values['dateto'] = $('#dp3').val();
        values['timeto'] = '23:59:59';
        values['accounts'] = $('#log_accounts').val();
        
		$.ajax({
			type: "POST",
			url: baseurl+'reports/scheduleAdd',
			data : values,
			success:function(data) {
				data = $.parseJSON(data);
				if(parseInt(data.responsecode) == 0) {
					thisobj.siblings('div.modal-body').append($('#error-notice').html());
					thisobj.siblings('div.modal-body').find('.alert span').html(data.message);
				} else {
					//refresh this page
					window.location.href = baseurl+'reports/transactions';
				}
			}
		});
	});

    $('.timepicker input').on("changeTime", timepicker_onchanged);
    $('.timepicker input').change(timepicker_onchanged);
    jQuery.ptTimeSelect.setTime = function() {
        var hr = jQuery('#ptTimeSelectUserSelHr').text();
        if (hr.length == 1) hr = '0' + hr;
        var tSel = hr
                    + ":"
                    + jQuery('#ptTimeSelectUserSelMin').text()
                    + " "
                    + jQuery('#ptTimeSelectUserSelAmPm').text();
        jQuery(".isPtTimeSelectActive").val(tSel);
        var name = $('.isPtTimeSelectActive').attr('name');
        this.closeCntr();
        timepicker_onchanged(name);
    }

    function timepicker_onchanged(picker_name)
    {
        var that = (typeof(picker_name) == 'string')? $('input[name='+picker_name+']') : $(this);
        var time_range = default_time_range();
        var timefrom = $('input[name=timefrom]');
        if (timefrom.length > 0) {
            var times = format_report_time(timefrom.val());
            time_range.hh_from = times[0];
            time_range.mm_from = times[1];
        }
        var timeto = $('input[name=timeto]');
        if (timeto.length > 0) {
            var times = format_report_time(timeto.val());
            time_range.hh_to = times[0];
            time_range.mm_to = times[1];
        }
        var hh = time_range.hh_from;
        var mm = time_range.mm_from;
        var ss = time_range.ss_from;
        if (that.get(0) === timeto.get(0)) {
            hh = time_range.hh_to;
            mm = time_range.mm_to;
            ss = time_range.ss_to;
        }
        var obj_name = (that.attr('name') == 'timefrom')? 'dp2' : 'dp3';

        $('#btn_filter').attr('disabled', true);
        if (datetimePickerRangeOnChanged(
          {
            'obj2': that,
            'alt_obj': that,
            'obj': $('#'+obj_name),
            'separator': '/',
            'm': 1,
            'd': 0,
            'y': 2,
            'hh': hh,
            'mm': mm,
            'ss': ss
          },
          {
            'alt_obj': timefrom,
            'obj': $('#dp2'),
            'separator': '/',
            'm': 1,
            'd': 0,
            'y': 2,
            'hh': time_range.hh_from,
            'mm': time_range.mm_from,
            'ss': time_range.ss_from
          },
          {
            'alt_obj': timeto,
            'obj': $('#dp3'),
            'separator': '/',
            'm': 1,
            'd': 0,
            'y': 2,
            'hh': time_range.hh_to,
            'mm': time_range.mm_to,
            'ss': time_range.ss_to
          }
        )) $('#btn_filter').removeAttr('disabled');
    }

});

