// jQuery plugin to prevent double submission of forms
jQuery.fn.preventDoubleSubmission = function() {
  $(this).on('submit',function(e){
    var $form = $(this);

    if ($form.data('submitted') === true) {
      // Previously submitted - don't submit again
      e.preventDefault();
    } else {
      // Mark it so that the next submit can be ignored
      $form.data('submitted', true);
    }
  });

  // Keep chainability
  return this;
};


$(function(){

  $('div.control-group div.controls input').focusout(function(){

    if ( this.name == 'mobilenumber' ||
         this.name == 'emailaddress' ) {
      $.post(
	    '/register/validate_field/' + this.name,
		$('form').serialize(),

        function(data) {

	      control_group = $('div#cg-' + data.fieldname);
		  control_group.find('span.help-inline').remove();
          help_inline = $('<span>').addClass('help-inline');

          if (!data.ok) {
            control_group.addClass('error');
		    help_inline.html('<span class="arrow"></span> ' + data.error);
			$('div#cg-' + data.fieldname + ' div.controls').append(help_inline);
			help_inline.show();
          } else {
            control_group.removeClass('error');
		  }
	    },
		'json'
	  );
    }
  });


	$('form').preventDoubleSubmission();
});

