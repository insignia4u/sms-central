function setnumber(){
  var i = 1;
  $('.contcheck').each(function(){
    $(this).find('.num').html(i);
    $(this).attr('id','concheck-' + i);
    i += 1;
  });
}




$(function(){

  $('#newtemplate input[type="radio"]').on('change', function() {

    if($('#selectrdio').is(':checked')) {
      $('.withtemplate').slideDown();
      $('.withouttemplate').slideUp();
    }
    else{
      $('.withtemplate').slideUp();
      $('.withouttemplate').slideDown();
      $('footer').css('style','position:static !important')
    }

    $('.buttons').show();

  });



  $("#e8, #e9, #select2").select2();
  $("#s-country").select2({
    allowClear: true
  });

  $('input.hiddenInput').focus(function(){
   var cameFrom = $('#myForm').data('lastIn');

   //check whether it came from the jQuery select menu
   if(cameFrom != 'jquery-ui-element'){
       $('jquery-ui-element').focus();
   } else {
       //focus previous sibling
       var inp = $('input');
       var index = inp.index(this);
       var prev = inp[index-1];
       prev.focus();
   }
});





$(window).bind("load", function() {

  var footerHeight = 0,
      footerTop = 0,
      $footer = $("footer");

  positionFooter();

  function positionFooter() {

    footerHeight = $footer.height();
    footerTop = ($(window).scrollTop()+$(window).height()-footerHeight-15)+"px";

    if ( ($(document.body).height()) < $(window).height()) {
      $footer.css({
        position: "absolute",
        width: "100%"
      }).animate({
        top: footerTop
      })
    } else {
      $footer.css({
        position: "static"
      })
    }
  }

  $(window).resize(positionFooter)
    .hover(positionFooter)
});




  $(".buttons-charts .btn").click(
    function(){
      var chartid = $(this).attr('id');
      $(".charts .chart").css('display','none');
      $(".charts div.gr-" + chartid).fadeIn("slow");
    }
  )

  $(".expand-collapse").click(
    function () {

      if($(this).closest("tr").hasClass("collapse-row")){

        $(this).closest("tr").removeClass("collapse-row");
        $(this).closest("tr").addClass("expand-row");
        $($(this).closest("tr")).next().show('slow');

      }
      else{

        $(this).closest("tr").removeClass("expand-row");
        $(this).closest("tr").addClass("collapse-row");
        $($(this).closest("tr")).next().attr("style", "display:none;");
      }

      return false;
  });

  if($('.multiple-tabs input').length){
    $('.multiple-tabs input').tagsInput({
      width:'auto',
	  height: 'auto',
      defaultText:'',
	  onAddTag: validatetags
    });
  }
  
function validatetags(e){
	if($(this).attr('data-validate') == 'email' && !validateEmail(e)){
		$(this).removeTag(e);
		$('#'+$(this).attr('id')+'_tag').addClass('not_valid');
		$('#'+$(this).attr('id')+'_tag').val(e);
	}
}

function validateEmail(email){
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}  

  $(".focus-info").on('focus', function() {
    $(this).next("span.tooltip-info").fadeIn(500).css('display','inline-block');
  });
  $(".focus-info").on('blur', function() {
    $(this).next("span.tooltip-info").fadeOut(300);
  });

  $(".datepicker-input input").on('focus', function() {
    $(this).next("span.add-on").addClass('focus');
  });
  $(".datepicker-input input").on('blur', function() {
    $(this).next("span.add-on").removeClass('focus');
  });

  $(".timepicker input").on('focus', function() {
    $(this).parent(".timeEntry_wrap").next("span.add-on").addClass('focus');
  });
  $(".timepicker input").on('blur', function() {
    $(this).parent(".timeEntry_wrap").next("span.add-on").removeClass('focus');
  });

  $('#dp2, #dp3').datepicker({
    format: 'dd/mm/yyyy',
    weekStart: 1
  });

  $('.ff-container input[type="radio"]').on('change', function() {
    $('.ff-container li').removeClass('active');
    $(this).closest('li').addClass('active');
    var checkboxID = $(this).attr('class').split('-');
    checkboxID = checkboxID[checkboxID.length-1];
    var itemID = '.ff-item-type-' + checkboxID

    if($('.ff-container input').is(':checked')) {
      $('.ff-items li').removeClass('showitems')
      $('.ff-items').removeClass('showallitems')
    }
    if($(this).is(':checked')) {
      if(itemID == '.ff-item-type-all'){
        $('.ff-items li').addClass('showitems')
      }else{
        $('.ff-items').removeClass('showallitems')
        $(itemID).addClass('showitems')
      }
    }


  });



  $('.send-receive input[type="radio"]').on('change', function() {
    if($('.send-receive input.checksending').is(':checked')) {
      $('#wizard .to').attr("style", "display:block;")
      $('#wizard .from').attr("style", "display:none;")
    }
    else{
      $('#wizard .to').attr("style", "display:none;")
      $('#wizard .from').attr("style", "display:block;")
    }
  })

  $('.listchecks .checkinput').on('change', function() {
    var container = "#" + $(this).closest("li.licheck").attr("id");
    if($(container + ' .checkinput').is(':checked')) {
      $(container + ' .contentcheck').show('slow')
    }
    else{
      $(container + ' .contentcheck').hide('slow')
    }
  })

  $('.checklog .custom-checkbox input').live('change', function() {
    var container = "#" + $(this).closest("li.contcheck").attr("id");
    if($(container + ' .checklog .custom-checkbox input[type="checkbox"]').is(':checked')) {
      $(container + ' .checkboxlog').show('slow')
    }
    else{
      $(container + ' .checkboxlog').hide('slow', function(){
        $(container + ' .checkboxlog').remove()
      })

    }
  })

  var scntDiv = $('#multifield');
  $('#addScnt').live('click', function() {
    var i = $('#multifield li.contcheck').size() + 1;
    var addinput = '<li style="display:none" class="contcheck"><div class="inputnum"><div class="num"></div><input type="text" placeholder="http://www.loremipsum.com"><a href="#" class="remScnt">remove url</a></div><div class="checklog"><a href="" class="helpicon">?</a><span class="custom-checkbox"><input type="checkbox" name="checkbox"><span class="box"><span class="tick"></span></span><label for="checkbox" class="checkbox">Need Authentication</label></span><div class="checkboxlog"><div class="boxdashed"><div class="inline"><label>Username:</label><input type="text" placeholder="johndoe"></div><div class="inline"><label>Password:</label><input type="password" placeholder="password"></div></div></div></div></li>';

    $(addinput).appendTo(scntDiv).slideDown();

    setnumber();

    return false;
  });

  $('.remScnt').live('click', function() { 
    if( $('#multifield li.contcheck').size() >= 2 ) {
      $(this).parents('li.contcheck').slideUp('fast', function() {
        $(this).remove();
        setnumber();
      });
    }

    return false;
  });
  $('.numphone a').live('click', function() { 
    var container = "." + $(this).closest(".credit").slideUp();

    return false;
  });

  $('form.form-type1 .show-table').live('click', function() { 
    $('form.form-type1 .show-table').addClass('hide')
    $('form.form-type1 .multiple-select').addClass('hide')
    $('form.form-type1 .show-select').removeClass('hide')
    $('form.form-type1 #table-1').removeClass('hide')
    return false;
  });

  $('form.form-type1 .show-select').live('click', function() { 
    $('form.form-type1 .show-select').addClass('hide')
    $('form.form-type1 #table-1').addClass('hide')
    $('form.form-type1 .multiple-select').removeClass('hide')
    $('form.form-type1 .show-table').removeClass('hide')
    return false;
  });

});




$(document).ready( function(){

  if($('.timepicker input').length){
    $('.timepicker input').ptTimeSelect({
      setButtonLabel: '<span>Set Time</span>'
    })
  }

  $('#cc-01').keyup(function(){
    if($(this).val().length > 3)
    {
      $('#cc-02').focus();
    }
  });
  $('#cc-02').keyup(function(){
    if($(this).val().length > 3)
    {
      $('#cc-03').focus();
    }
  });
  $('#cc-03').keyup(function(){
    if($(this).val().length > 3)
    {
      $('#cc-04').focus();
    }
  });
  $('#cc-04').keyup(function(){
    if($(this).val().length > 3)
    {
      $('#cc-05').focus();
    }
  });
  $('#cc-05').keyup(function(){
    if($(this).val().length > 3)
    {
      $('#cc-06').focus();
    }
  });

  setnumber();

  var leftHeight = $(".sidebar").height();
  var rightHeight = $("#report").height();
  if (leftHeight > rightHeight){ $("#report").height(leftHeight)}
  else{ $(".sidebar").height(rightHeight - 24)};

  var rightHeight = $("#send-receive").height();
  if (leftHeight > rightHeight){ $("#send-receive").height(leftHeight)}
  else{ $(".sidebar").height(rightHeight - 30)};

  var rightHeight = $("#advanced-settings").height();
  if (leftHeight > rightHeight){ $("#advanced-settings").height(leftHeight)}
  else{ $(".sidebar").height(rightHeight - 14)};

  var rightHeight = $("#numberpost").height();
  if (leftHeight > rightHeight){ $("#numberpost").height(leftHeight)}
  else{ $(".sidebar").height(rightHeight - 94)};

  var rightHeight = $("#message-log").height();
  if (leftHeight > rightHeight){ $("#message-log").height(leftHeight)}
  else{ $(".sidebar").height(rightHeight - 7)};

  var rightHeight = $("#message-log.alignh2").height();
  if (leftHeight > rightHeight){ $("#message-log.alignh2").height(leftHeight)}
  else{ $(".sidebar").height(rightHeight + 3)};

  var rightHeight = $(".wizard .contentleft").height();
  if (leftHeight > rightHeight){ $(".wizard .contentleft").height(leftHeight)}
    else{ $(".sidebar").height(rightHeight - 19)};

  var rightHeight = $("#wizard").height();
  if (leftHeight > rightHeight){ $("#wizard").height(leftHeight)}
    else{ $(".sidebar").height(rightHeight - 19)};

  var rightHeight = $(".postpaid").height();
  if (leftHeight > rightHeight){ $(".postpaid").height(leftHeight)}
    else{ $(".sidebar").height(rightHeight - 59)};


  $('.tagsarea li a').click(function(e){
    e.preventDefault();
    $($(this).parent().parent().data('target')).insertAtCaret($(this).html());
  })
})

$('input[placeholder], textarea[placeholder]').placeholder();

$(function(){
  $('#dp2').datepicker().on("changeDate",function() { $("#dp2").datepicker("hide"); } );
  $('#dp3').datepicker().on("changeDate",function() { $("#dp3").datepicker("hide"); } );
  $('#selectpage1, #speedC, #country, #date01, #date02').selectmenu({style:'dropdown', maxHeight: 170});
});

$(".level1 input").click(function (){
  $(".level1").removeClass('active');
  $(this).parents('.level1').addClass('active');
});

$(".packages .level1").hover(
  function (){
    $(this).addClass('hover');
  },
  function(){
    $(this).removeClass('hover');
  });

$("input.yes").click(function (){
  $(".optionhidden").removeClass('hidden');
  $(".optionhidden").addClass('visible');
});

$("input.no").click(function (){
  $(".optionhidden").removeClass('visible');
  $(".optionhidden").addClass('hidden');
});

$("input.spack").hover(
  function () {
    $(this).parents('.custom-radio').addClass('hover');
  },
  function () {
    $(this).parents('.custom-radio').removeClass('hover');
  }
);

$(function(){
    $('#selectcallback').selectmenu({
      style:'dropdown',
      change: function () { 
        $(".selectswitch").slideDown();
      } 
    });
});

$(".contentleft .credit .level1").hover(
  function () {
    $(this).addClass('hover');
  },
  function () {
    $(this).removeClass('hover');
  }
);

var $remaining = $('.remaining'),
    $messages = $remaining.next();

$('.message').keyup(function() {
    var chars = this.value.length,
    messages = Math.ceil(chars / 160),
    //remaining = messages * 160 - (chars % (messages * 160) || messages * 160);
    remaining = chars - ((messages - 1) * 160);
    $remaining.text(remaining);
    $messages.text(messages);
});




$.fn.extend({
  insertAtCaret: function(myValue){
  var obj;
  if( typeof this[0].name !='undefined' ) obj = this[0];
  else obj = this;

  if ($.browser.msie) {
    obj.focus();
    sel = document.selection.createRange();
    sel.text = myValue;
    obj.focus();
    }
  else if ($.browser.mozilla || $.browser.webkit) {
    var startPos = obj.selectionStart;
    var endPos = obj.selectionEnd;
    var scrollTop = obj.scrollTop;
    obj.value = obj.value.substring(0, startPos)+myValue+obj.value.substring(endPos,obj.value.length);
    obj.focus();
    obj.selectionStart = startPos + myValue.length;
    obj.selectionEnd = startPos + myValue.length;
    obj.scrollTop = scrollTop;
  } else {
    obj.value += myValue;
    obj.focus();
   }
 }
})

/**
 * Message log init functions
 * Only runs if #message-log is founded in the body
 */
jQuery(function($){

  // The next code only runs in #message-log
  if (!$('body').has('#message-log')) return false;

  // selectmenu init
  $('#log_direction, #log_from_number, #log_to_number, #log_from_number_number, #log_to_number_number, #schedule_frequency, #log_type, #log_groupby, #log_status').selectmenu({style:'dropdown', maxHeight: 170});

  // datepicker init
  $('#log_date_from, #log_date_to').datepicker({
      format: 'dd/mm/yyyy',
      weekStart: 1
  });

  // timepicker init
  if($('.timepicker input').length){
    $('.timepicker input').timeEntry({
        ampmPrefix: ' ',
        spinnerImage: '',
        useMouseWheel: true,
        defaultTime: '00:00 AM'
    });
  }

  // Select2 init
  $('#log_campaigns, #log_users').select2();


  // From & To init
  $('#log_from_number, #log_to_number').on('change', function (ev) {

      var option = $(this).val(),
          parentBlock = $(this).parents('.block');

      // Remove previous elements
      parentBlock.find('.option').addClass('hidden');

      // Clear input & select data
      parentBlock.find('.option input').val('');
      parentBlock.find('.option select').val('');
      // Hack to update selectmenu plugin
      parentBlock.find('.option .ui-selectmenu-status').html('All');

      // Switch between options
      if(option === 'type_any_number') {
          parentBlock.find('.type-any-number-option').removeClass('hidden');
      } else if (option === 'dedicated') {
          parentBlock.find('.log-from-number-dedicated-option').removeClass('hidden');
      }

  });

  // Toggle Filters
  $('.log-footer').on('click', 'a', function (ev) {
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

  if($('.charts').length){

    var chart;
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graph01',
            type: 'area',
            width: 726,
            height: 400
            
        },
        legend: {
            enabled: false
        },
        title: {
            text: ""
        },
        credits: {
            enabled: false
           
        },
        xAxis: {
            categories: ['27 May', '29 May', '31 May', '02 Jun', '04 Jun', '06 Jun'],
            title: {
                enabled: false
            },
            gridLineWidth: 1,
            gridLineColor: '#ececec'
            
        },
        yAxis: {
            title: {
                text: ''
            },
            gridLineColor: '#ececec',
            labels: {
                formatter: function() {
                    return this.value;
                }
            }
        },
        exporting: {
              enabled: false
          },
        tooltip: {
            formatter: function() {
                var number = Highcharts.numberFormat(this.y, 0, ',');
                return ''+
                     '<div style="text-align:center">'+this.x+'</div><br><div style="text-align:center">'+number.toString()+'</div><br><div style="text-align:center"><span style="color:#00aef1">SMS</span></div>';
            },
            borderColor: '#00aef1'
           
        },
        
        series: [{
            name: 'Hours',
            title: false,
            data: [502, 635, 809, 947, 1402, 1634],
            color: '#f6fdf5',
            lineColor: '#50b849',
            shadow: false,
              marker: {
                  fillColor: '#50b849',
                  lineWidth: 0,
                  lineColor: null            // inherit from series

              }
          
        }]
    });

    var chart2;
    chart2 = new Highcharts.Chart({
        chart: {
            renderTo: 'graph02',
            type: 'area',
            width: 726,
            height: 400
            
        },
        legend: {
            enabled: false
        },
        title: {
            text: ""
        },
        credits: {
            enabled: false
           
        },
        xAxis: {
            categories: ['27 May', '29 May', '31 May', '02 Jun', '04 Jun', '06 Jun'],
            title: {
                enabled: false
            },
            gridLineWidth: 1,
            gridLineColor: '#ececec'
            
        },
        yAxis: {
            title: {
                text: ''
            },
            gridLineColor: '#ececec',
            labels: {
                formatter: function() {
                    return this.value;
                }
            }
        },
        exporting: {
          enabled: false
        },
        tooltip: {
            formatter: function() {
                var number = Highcharts.numberFormat(this.y, 0, ',');
                return ''+
                     '<div style="text-align:center">'+this.x+'</div><br><div style="text-align:center">'+number.toString()+'</div><br><div style="text-align:center"><span style="color:#00aef1">SMS</span></div>';
            },
            borderColor: '#00aef1'
           
        },
        
        series: [{
            name: 'Days',
            title: false,
            data: [102, 235, 909, 447, 1202, 1534],
            color: '#f6fdf5',
            lineColor: '#50b849',
            shadow: false,
              marker: {
                  fillColor: '#50b849',
                  lineWidth: 0,
                  lineColor: null            // inherit from series

              }
          
        }]
    });

    var chart3;
    chart3 = new Highcharts.Chart({
        chart: {
            renderTo: 'graph03',
            type: 'area',
            width: 726,
            height: 400
            
        },
        legend: {
            enabled: false
        },
        title: {
            text: ""
        },
        credits: {
            enabled: false
           
        },
        xAxis: {
            categories: ['27 May', '29 May', '31 May', '02 Jun', '04 Jun', '06 Jun'],
            title: {
                enabled: false
            },
            gridLineWidth: 1,
            gridLineColor: '#ececec'
            
        },
        yAxis: {
            title: {
                text: ''
            },
            gridLineColor: '#ececec',
            labels: {
                formatter: function() {
                    return this.value;
                }
            }
        },
        exporting: {
          enabled: false
        },
        tooltip: {
            formatter: function() {
                var number = Highcharts.numberFormat(this.y, 0, ',');
                return ''+
                     '<div style="text-align:center">'+this.x+'</div><br><div style="text-align:center">'+number.toString()+'</div><br><div style="text-align:center"><span style="color:#00aef1">SMS</span></div>';
            },
            borderColor: '#00aef1'
           
        },
        
        series: [{
            name: 'Weeks',
            title: false,
            data: [502, 635, 109, 147, 1002, 1334],
            color: '#f6fdf5',
            lineColor: '#50b849',
            shadow: false,
              marker: {
                  fillColor: '#50b849',
                  lineWidth: 0,
                  lineColor: null            // inherit from series

              }
          
        }]
    });
  }

});
