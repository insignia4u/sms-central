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


function validate( $field )
{
  if ( !(validation = get_validation( $field )))
    return true;

  var $group = $field.closest('.control-group');
  validation = validation.split(':');

  switch ( validation[0] )
  {      
    case 'empty':
      if ( $field.val() == '' || /^\s*$/.test($field.val()) ) {
        $group.addClass('error');
        return false;
      } else {
        $group.removeClass('error');
        return true;
      }
    break;
    case 'email':
      var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if ( $field.val() == '' || !regex.test($field.val()) ) {
        $group.addClass('error');
        return false;
      } else {
        $group.removeClass('error');
        return true;
      }
    break;
    case 'password':
      var regex = /(.){6,}/;
      if ( $field.val() == '' || !regex.test($field.val()) ) {
        $group.addClass('error');
        return false;
      } else {
        $group.removeClass('error');
        return true;
      }
    break;
    case 'match':
      var $linked = $(validation[1]);
      if ( !validate($linked) ) {
        $group.addClass('error');
        return false;
      }
      if ( $field.val() != $linked.val() ) {
        $group.addClass('error');
        return false;
      }
      $group.removeClass('error');
      return true;
    break;
  }
}

function configure_validation( $field )
{
  validation = $field.attr('data-validate') || false;
  $field.removeAttr('data-validate').data('validate', validation);
}

function get_validation( $field )
{
  return $field.data('validate');
}

function get_group( $field )
{
  return $field.closest('.control-group');
}

$(document).ready(function() {

  $('form').each(function(i){

    var $form = $(this);
    var $fields = $form.find('input[type=text], input[type=password]');
    var is_posting = $form.hasClass('posting');
    
    $fields.each(function(i){
      
      var $field = $(this);
      var $group = $field.closest('.control-group');
      configure_validation($field);      
      
      if ( is_posting )
        validate( $field );
      
      $field
      .bind('focus', function(){
        validate( $field );
        $group.addClass('focus');
      })
      .bind('blur', function(){
        validate( $field );
        $group.removeClass('focus');
      })
      .bind('keyup', function(){
        validate( $field );
      });
      
    });    
  });

	$('form').preventDoubleSubmission();

});
