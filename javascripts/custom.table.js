$(function () {
  $('.t01 .custom-checkbox input[type="checkbox"]').on('change', function() {
    var checkboxID = $(this).attr('id').substr(9,3);
    var trashID = 'td.trash-' + checkboxID
    var trID = 'tr#item-' + checkboxID

    if($(this).attr('checked') == 'checked') {
      $('.t01 ' + trashID).addClass('showicons')
      $('.t01 ' + trID).addClass('selected')
    } else {
      $('.t01 ' + trashID).removeClass('showicons');
      $('.t01 ' + trID).removeClass('selected');
    }

    if ($('.t01 .custom-checkbox input:checked').size() > 0){
      $('.t01 #table-footer-1').css('display','none')
      $('.t01 #table-footer-2').css('display','block')
    }else{
      $('.t01 #table-footer-1').css('display','block')
      $('.t01 #table-footer-2').css('display','none')  
    }
  });
  
  $('.t02 .custom-checkbox input[type="checkbox"]').on('change', function() {
    var checkboxID = $(this).attr('id').substr(9,3);
    var trashID = 'td.trash-' + checkboxID
    var trID = 'tr#item-' + checkboxID

    if($(this).attr('checked') == 'checked') {
      $('.t02 ' + trashID).addClass('showicons')
      $('.t02 ' + trID).addClass('selected')
    } else {
      $('.t02 ' + trashID).removeClass('showicons');
      $('.t02 ' + trID).removeClass('selected');
    }

    if ($('.t02 .custom-checkbox input:checked').size() > 0){
      $('.t02 #table-footer-1').css('display','none')
      $('.t02 #table-footer-2').css('display','block')
    }else{
      $('.t02 #table-footer-1').css('display','block')
      $('.t02 #table-footer-2').css('display','none')  
    }
  });
  
  $('.t03 .custom-checkbox input[type="checkbox"]').on('change', function() {
    var checkboxID = $(this).attr('id').substr(9,3);
    var trashID = 'td.trash-' + checkboxID
    var trID = 'tr#item-' + checkboxID

    if($(this).attr('checked') == 'checked') {
      $('.t03 ' + trashID).addClass('showicons')
      $('.t03 ' + trID).addClass('selected')
    } else {
      $('.t03 ' + trashID).removeClass('showicons');
      $('.t03 ' + trID).removeClass('selected');
    }

    if ($('.t03 .custom-checkbox input:checked').size() > 0){
      $('.t03 #table-footer-1').css('display','none')
      $('.t03 #table-footer-2').css('display','block')
    }else{
      $('.t03 #table-footer-1').css('display','block')
      $('.t03 #table-footer-2').css('display','none')  
    }
  });    

  $(".select-all-visible").live("click", function() {
    var container = "#" + $(this).closest("div.table-box").attr("id");
    $(container + " input:checkbox").filter(':visible').each(function() {
      this.checked = "checked";
      var checkboxID = $(this).attr('class').substr(9,3);
      var trashID = container + ' td.trash-' + checkboxID
      var trID = container + ' tr.item-' + checkboxID

      if($(this).attr('checked') == 'checked') {
        $(trashID).addClass('showicons')
        $(trID).addClass('selected')
        $(container + ' .table-footer-1').css('display','none')
        $(container + ' .table-footer-2').css('display','block')
      } else {
        $(trashID).removeClass('showicons')
        $(trID).removeClass('selected')
        $(container + ' .table-footer-1').css('display','block')
        $(container + ' .table-footer-2').css('display','none')
      }
		$(this).trigger('change');
    });
  });


  $(".uncheck-all-visible").live("click", function() {
    var container = "#" + $(this).closest("div.table-box").attr("id");
    $(container + " input:checkbox").filter(':visible').each(function() {
      $(container + ' input:checkbox').removeAttr('checked');
      var checkboxID = $(this).attr('class').substr(9,3);
      var trashID = container + ' td.trash-' + checkboxID
      var trID = container + ' tr.item-' + checkboxID

      $(trashID).removeClass('showicons')
      $(trID).removeClass('selected')
      $(container + ' .table-footer-1').css('display','block')
      $(container + ' .table-footer-2').css('display','none')
		$(this).trigger('change');
    });
  });

});



