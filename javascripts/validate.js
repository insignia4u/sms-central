$(document).ready(function(){
// ====================================================== //

var jVal = {
  'fullName' : function() {
  
    $('body').append('<div id="nameInfo" class="validate-info"></div>');

    var nameInfo = $('#nameInfo');
    var ele = $('#fullname');
    var pos = ele.offset();
    
    nameInfo.css({
      top: pos.top,
      left: pos.left+ele.width()+27
    });

    if(ele.val().length < 10) {
      jVal.errors = true;
        nameInfo.removeClass('validate-correct').addClass('validate-error').html('<span class="validation-arrow"></span> at least 10 characters').fadeIn();
        ele.removeClass('normal').addClass('wrong');
        ele.closest('.control-group').removeClass('success');
        ele.closest('.control-group').addClass('error')
    } else {
        nameInfo.removeClass('validate-error').addClass('validate-correct').html('<div class="icon-ok"></div>').fadeIn();
        ele.removeClass('wrong').addClass('normal');
        ele.closest('.control-group').addClass('success');
        ele.closest('.control-group').removeClass('error')
    }
  },

  'birthDate' : function (){

    $('body').append('<div id="birthInfo" class="validate-info"></div>');

    var birthInfo = $('#birthInfo');
    var ele = $('#birthday');
    var pos = ele.offset();

    birthInfo.css({
      top: pos.top,
      left: pos.left+ele.width()+27
    });

    var patt = /^[0-9]{2}\-[0-9]{2}\-[0-9]{4}$/i;

    if(!patt.test(ele.val())) {
      jVal.errors = true;
        birthInfo.removeClass('validate-correct').addClass('validate-error').html('<span class="validation-arrow"></span> type in date in format dd/mm/yyyy').show();
        ele.removeClass('normal').addClass('wrong');
        ele.closest('.control-group').removeClass('success');
        ele.closest('.control-group').addClass('error')
    } else {
        birthInfo.removeClass('validate-error').addClass('validate-correct').html('<div class="message-success"><span class="validation-arrow"></span> Good</div>').show();
        ele.removeClass('wrong').addClass('normal');
        ele.closest('.control-group').addClass('success');
        ele.closest('.control-group').removeClass('error')
    }
  },

  'gender' : function (){

    $('body').append('<div id="genderInfo" class="validate-info"></div>');
  
    var genderInfo = $('#genderInfo');
    var ele = $('#woman');
    var pos = ele.offset();
    
    genderInfo.css({
      top: pos.top-10,
      left: pos.left+ele.width()+222
    });
    
    if($('input[name="gender"]:checked').length === 0) {
      jVal.errors = true;
        genderInfo.removeClass('validate-correct').addClass('validate-error').html('<span class="validation-arrow"></span> are you a man or a woman?').show();
        ele.removeClass('normal').addClass('wrong');
        ele.closest('.control-group').removeClass('success')
    } else {
        genderInfo.removeClass('validate-error').addClass('validate-correct').html('<div class="icon-ok"></div>').show();
        ele.removeClass('wrong').addClass('normal');
        ele.closest('.control-group').addClass('success')
    }
  },
  
  'vehicle' : function (){
  
    $('body').append('<div id="vehicleInfo" class="validate-info"></div>');
  
    var vehicleInfo = $('#vehicleInfo');
    var ele = $('#checkbox2');
    var pos = ele.offset();
    
    vehicleInfo.css({
      top: pos.top-10,
      left: pos.left+ele.width()+233
    });
    
    if($('input[name="vehicle"]:checked').length <= 0) {
      jVal.errors = true;
        vehicleInfo.removeClass('validate-correct').addClass('validate-error').html('<span class="validation-arrow"></span> I\'m sure you have at least two!').show();
        ele.removeClass('normal').addClass('wrong');
        ele.closest('.control-group').removeClass('success')
    } else {
        vehicleInfo.removeClass('validate-error').addClass('validate-correct').html('<div class="icon-ok"></div>').show();
        ele.removeClass('wrong').addClass('normal');
        ele.closest('.control-group').addClass('success')
    }
  },
  
  'email2' : function() {
  
    $('body').append('<div id="emailInfo" class="validate-info"></div>');
  
    var emailInfo = $('#emailInfo');
    var ele = $('#email2');
    var pos = ele.offset();
    
    emailInfo.css({
      top: pos.top,
      left: pos.left+ele.width()+27
    });
    
    var patt = /^.+@.+[.].{2,}$/i;
    
    if(!patt.test(ele.val())) {
      jVal.errors = true;
        emailInfo.removeClass('validate-correct').addClass('validate-error').html('<span class="validation-arrow"></span> give me a valid email adress, ok?').show();
        ele.removeClass('normal').addClass('wrong');
        ele.closest('.control-group').removeClass('success');
        ele.closest('.control-group').addClass('error')
    } else {
        emailInfo.removeClass('validate-error').addClass('validate-correct').html('<div class="icon-ok"></div>').show();
        ele.removeClass('wrong').addClass('normal');
        ele.closest('.control-group').addClass('success');
        ele.closest('.control-group').removeClass('error')
    }
  },

  'sendIt' : function (){
    if(!jVal.errors) {
      $('#jform').submit();
    }
  }
};

// ====================================================== //

$('#send').click(function (){
  var obj = $.browser.webkit ? $('body') : $('html');
  obj.animate({ scrollTop: $('#jform').offset().top }, 750, function (){
    jVal.errors = false;
    jVal.fullName();
    jVal.birthDate();
    jVal.gender();
    jVal.vehicle();
    jVal.email2();
    jVal.sendIt();
  });
  return false;
});

$('#fullname').change(jVal.fullName);
$('#birthday').change(jVal.birthDate);
$('input[name="gender"]').change(jVal.gender);
$('input[name="vehicle"]').change(jVal.vehicle);
$('#email2').change(jVal.email2);

// ====================================================== //
});