$(function () {

  $("#logo-row").on('mouseenter', function() {
		$('#logo-actions').css('display','block')
  });

  $("#logo-row").on('mouseleave', function() {
		$('#logo-actions').css('display','none')
  });

});
