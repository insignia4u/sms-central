
var originalSerializeArray = $.fn.serializeArray;
$.fn.extend({
    serializeArray: function () {
    	var brokenSerialization = originalSerializeArray.apply(this);

        var values = $('input[placeholder], textarea[placeholder]').map(function () {
            if (this.placeholder == undefined) this.placeholder = $(this).attr('placeholder');
        	thevalue = ''
        	if ((this.placeholder != undefined) && this.value == this.placeholder)
        		thevalue = '';
        	else thevalue = this.value;
            return { 'name': this.name, 'value': thevalue };
        }).get();
        
        var valueKeys = $.map(values, function (element) { return element.name; });

        var oldvalues = $.grep(brokenSerialization, function (element) {
            return $.inArray(element.name, valueKeys) == -1;
        });

        return $.merge(oldvalues, values);
    }
});


$(function(){
    $(window).unbind();

    $(window).bind("load", function() {

  var footerHeight = 0,
      footerTop = 0,
      $footer = $("footer");

  positionFooter();

  function positionFooter() {

    footerHeight = $footer.height();
    footerTop = ($(window).scrollTop()+$(window).height()-footerHeight-15)+"px";
	// When footer is in absolute position, $(document.body).height() does not include 
	// footer height so we need to add it manually
	if($footer.css('position') == 'absolute'){
		documentHeight = $(document.body).height() + footerHeight;
	}
	else{
		documentHeight = $(document.body).height();
	}
    if ( documentHeight < $(window).height()) {
      $footer.css({
        position: "absolute",
        width: "100%", bottom : 0
      });
    } else {
      $footer.css({
        position: "static"
      })
    }
  }
	
	$footer.hover(positionFooter);
	$(window).resize(positionFooter)
    .hover(positionFooter)
});
});

function dateToTime(obj, separator, y, m, d, hh, mm, ss)
{
    var ret = null;
    var val = obj.val() + '';
    if (val == obj.attr('placeholder'))
    {
     val = '';
     obj.val(val);
    }
    if (val.length > 0) {
        ret = Number.NaN;
        var dt = val.split(separator);
        if (dt.length == 3) {
            if (dt[m].substr(0, 1) == '0') dt[m] = dt[m].substr(1);
            if (dt[d].substr(0, 1) == '0') dt[d] = dt[d].substr(1);
            var formattedDate = dt[y] + '-' + dt[m] + '-' + dt[d];
            var y = parseInt(dt[y]);
            var m = parseInt(dt[m]) - 1;
            var d = parseInt(dt[d]);
 
            var aDate = new Date(y, m, d, hh, mm, ss);
		
			var regex = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}$/
 			if(!regex.test(val) || aDate.getFullYear() > 9999 || aDate.getFullYear() < 1970 || y > 9999 || y < 1970)
 			{
 		        ret = Number.NaN;
 			}	
            else if(aDate.getMonth() == m && aDate.getDate() == d && aDate.getFullYear() == y)
            {
	            ret = parseFloat($.datepicker.formatDate('@',aDate).toString());            
            }
 
        }
    }
    return ret;
}

function datetimePickerRangeOnChanged(that, from, to, thatTime, fromTime, toTime)
{
    var ok = true;

    var style = '';
    var res = dateToTime(that.obj, that.separator, that.y, that.m, that.d, that.hh, that.mm, that.ss);
    	
    if (res != null) {
        try {
            if (isNaN(res)) throw 'invalid date';

            if (that.alt_obj.length > 0) {
                if (that.alt_obj.get(0) === from.alt_obj.get(0)) {
                    var resTo = dateToTime(to.obj, to.separator, to.y, to.m, to.d, to.hh, to.mm, to.ss);
                    if (resTo != null && !isNaN(resTo)) {
                        if (resTo < res) throw 'From must be on or before To';
                        if (resTo > 0) {
                            from.obj.attr('style', '');
                            from.alt_obj.attr('style', '');
                            to.obj.attr('style', '');
                            to.alt_obj.attr('style', '');
                        }
                    }
                }
                else {
                    var resFrom = dateToTime(from.obj, from.separator, from.y, from.m, from.d, from.hh, from.mm, from.ss);
                    if (resFrom != null && !isNaN(resFrom)) {
                        if (resFrom > res) throw 'To must be on or after From';
                        if (resFrom > 0) {
                            to.obj.attr('style', '');
                            to.alt_obj.attr('style', '');
                            from.obj.attr('style', '');
                            from.alt_obj.attr('style', '');
                        }
                    }
                }
            }
            else {
                if (that.obj.get(0) === from.obj.get(0)) { /* FROM, should be on or before TO */
                    var resTo = dateToTime(to.obj, to.separator, to.y, to.m, to.d, to.hh, to.mm, to.ss);
                    if (resTo != null && !isNaN(resTo)) {
                        if (resTo < res) throw 'From must be on or before To';
                        if (resTo > 0) to.obj.attr('style', '');
                    }
                }
                else { /* TO, should be on or after FROM */
                    var resFrom = dateToTime(from.obj, from.separator, from.y, from.m, from.d, from.hh, from.mm, from.ss);
                    if (resFrom != null && !isNaN(resFrom)) {
                        if (resFrom > res) throw 'To must be on or after From';
                        if (resFrom > 0) from.obj.attr('style', '');
                    }
                }
            }
        }
        catch (e) {
            style = 'background-color: #FF6666; color: white;';
            ok = false;
        }
    }

    if (typeof(that.obj2) != 'undefined' && that.obj2.length > 0) that.obj2.attr('style', style);
    else that.obj.attr('style', style);
    return ok;
}

function default_time_range()
{
    return {
        'hh_from': 0,
        'mm_from': 0,
        'ss_from': 0,
        'hh_to': 23,
        'mm_to': 59,
        'ss_to': 59
    };
}

function format_report_time(val)
{
    val = val + '';
    var x = val.split(' ');
    if (typeof(x[1]) == undefined) x[1] = 'A';
    var times = x[0].split(':');
    times[0] = parseInt(times[0]);
    if (typeof(times[1]) == undefined) times[1] = 0;
    times[1] = parseInt(times[1]);
    if (times[0] == 12) times[0] = 0;
    if (x[1] == 'PM') times[0] += 12;
    return times;
}

$(function(){

  $('#dp2, #dp3').datepicker().on("changeDate",function() {
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
    var that = timefrom;
    if ($(this).get(0) === $('#dp3').get(0)) {
        hh = time_range.hh_to;
        mm = time_range.mm_to;
        ss = time_range.ss_to;
        that = timeto;
    }

    $('#btn_filter').attr('disabled', true);
    if (datetimePickerRangeOnChanged(
      {
        'alt_obj': that,
        'obj': $(this),
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

    $(this).datepicker("hide");
  });

  $("#dp2, #dp3").datepicker().change(function() {
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
    var that = timefrom;
    if ($(this).get(0) === $('#dp3').get(0)) {
        hh = time_range.hh_to;
        mm = time_range.mm_to;
        ss = time_range.ss_to;
        that = timeto;
    }

    $('#btn_filter').attr('disabled', true);
    if (datetimePickerRangeOnChanged(
      {
        'alt_obj': that,
        'obj': $(this),
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
  });

});

$(document).ready(function(){
  $("#dp2, #dp3").datepicker().change();
  $('.timepicker input').change();
});

function expand_collapse_alt(tthis)
{
	if ($(tthis).closest("tr").hasClass("collapse-row"))
	{
		expand_table_row(tthis);
	}
	else
	{
		collapse_table_row(tthis);
	}
}

function show_top_notification(msg, type)
{
	if (typeof(type) == 'undefined') type = 'error';
	var prepend_alert = '<div class="alert alert-'+type+'"><button class="close" data-dismiss="alert">x</button><i class="icon-exclamation-white"></i>'+msg+'</div>';
	$('.alert.alert-'+type).remove();
	$('body').prepend(prepend_alert);
	$('html, body').animate({scrollTop:0}, 'fast');
}

function expand_table_row(tthis)
{
	$(tthis).closest("tr").removeClass("collapse-row");
	$(tthis).closest("tr").addClass("expand-row");
	$($(tthis).closest("tr")).next().show('slow');
}

function collapse_table_row(tthis)
{
	$(tthis).closest("tr").removeClass("expand-row");
	$(tthis).closest("tr").addClass("collapse-row");
	$($(tthis).closest("tr")).next().attr("style", "display:none;");
}



$('document').ready(function(){
	$('body :input').each(function(){
		if (($(this).prop('tagName') + '').toLowerCase() != 'select' || $(this).hasClass('customselect')) return;
		$(this).next().hide();
		$(this).select2();
	});
});


g_smsc_windows = {};
function view_all_accounts(url, id, attributes)
{
	if (typeof(attributes) == 'undefined') attributes = 'view_alladminaccounts','location=0,scrollbars=1,resizable=1,height=700,width=780';
	if (typeof(id) == 'undefined')
	{
		id = g_smsc_windows.length;
	}

	if (typeof(g_smsc_windows[id]) == 'undefined' || g_smsc_windows[id].closed)
	{
		g_smsc_windows[id] = window.open(url, attributes);
	}
	if (window.focus) g_smsc_windows[id].focus();
}

function search_autocomplete(select_id, url, params)
{
	var multiple = true;
	if (typeof(params.multiple) != 'undefined') multiple = params.multiple;
	$('#'+select_id).select2({
		initSelection: function(element, callback) {
			return $.ajax({
				url: url,
				dataType: 'json',
				data: {
					ids: params.default_value
				},
				success: function(data){
					if (data.length == 1) data = data[0];
					callback(data);
				}
			});
		},
		multiple: multiple,
		ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
			url: url,
			data: function (term, page) {
				return {
					search: term, // search term
					limit: 10
				};
			},
			results: function (data, page) { // parse the results into the format expected by Select2.
				// since we are using custom formatting functions we do not need to alter remote JSON data
				data =  jQuery.parseJSON(data);
				if (typeof(params.callback) == 'function') data = params.callback(data);
				return {results: data};
			}
		},
		formatResult: function(data){
			var markup = "<table class='movie-result'><tr>";
			markup += "<td class='data-info'><div class='data-title'>" + data.name + "</div>";
			markup += "</td></tr></table>"
			return markup;
		},
		formatSelection: function(data){
			return data.name;
		},
		dropdownCssClass: "bigdrop" // apply css that makes the dropdown taller
	});
}

function selectmenu_change(select_id, value, unchanged)
{
	if (typeof(unchanged) == 'undefined') unchanged = false;
	var id = '#'+select_id;
	if ($(id).length <= 0) return;
	$(id).val(value);
	$(id).selectmenu('value', $(id+' option[value="'+value+'"]').index());
	if (!unchanged) $(id).change();
}
