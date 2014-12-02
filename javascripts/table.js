$(function () {
  $('table .custom-checkbox input[type="checkbox"]').on('change', function() {
    var container = "#" + $(this).closest("div.table-box").attr("id");
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
  });



  $(".table-box tr td").hover(
    function () {
      var container = "#" + $(this).closest("div.table-box").attr("id");
      var trID = $(this).parent().attr('class').substr(5,2);
      var trashID = container + ' td.trash-' + trID
      var trashIDhas = $(trashID).hasClass('showicons')

      if(!trashIDhas)
      {
        $(trashID).addClass('showicons')
      }
    },
    function () {
      var container = "#" + $(this).closest("div.table-box").attr("id");
      var trID = $(this).parent().attr('class').substr(5,2);
      var checkboxID = container + ' .checkbox-' + trID;

      if($(checkboxID).attr('checked') == undefined) {
        var trashID = container + ' td.trash-' + trID
        $(trashID).removeClass('showicons')
      }
    }
  );

  $(".table-box .table-top tr td").hover(
    function () {
      var container = "#" + $(this).closest("div.table-box").attr("id");
      var trID = $(this).closest("tr").attr('class').substr(5,3);
      var trashID = container + ' td.trash-' + trID
      var trashIDhas = $(trashID).hasClass('showicons')

      if(!trashIDhas)
      {
        $(trashID).addClass('showicons')
      }
    },
    function () {
      var container = "#" + $(this).closest("div.table-box").attr("id");
      var trID = $(this).parent().attr('class').substr(5,3);
      var checkboxID = container + ' .checkbox-' + trID;

      if($(checkboxID).attr('checked') == undefined) {
        var trashID = container + ' td.trash-' + trID
        $(trashID).removeClass('showicons')
      }
    }
  );

  $('.table-box td.list a').on('click', function(event) {
    var container = "#" + $(this).closest("div.table-box").attr("id");
    event.preventDefault();

    var listID = $(this).attr('class').substr(18,2);
    var trID = container + ' .item-' + listID;
    var detailID = container + ' .item-detail-' + listID;

    if($(this).hasClass('list-active')) {
      $(this).removeClass('list-active')
      $(trID).removeClass('open')
      $(detailID).attr("style", "display:none;")
    } else {
      $(this).addClass('list-active')
      $(trID).addClass('open')
      
      $(detailID).show('slow')
    }

    event.stopPropagation;
    return false;


  });

  $(".select-all").live("click", function() {
    var container = "#" + $(this).closest("div.table-box").attr("id");
    $(container + " input:checkbox").each(function() {
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


  $(".uncheck-all").live("click", function() {
    var container = "#" + $(this).closest("div.table-box").attr("id");
    $(container + " input:checkbox").each(function() {
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
