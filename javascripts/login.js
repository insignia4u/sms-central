$(function () {

  $("form #email, form #password").on('focus', function() {
    var klass = $(this).parent().find("i").attr("class")
    $(this).parent().find("i").attr("class", klass.replace("gray", "blue"))

    $(this).parent().find("span.add-on").addClass("focus")
    $(this).addClass("focus-input")
  });

  $("form #email, form #password").on('blur', function() {
    var klass = $(this).parent().find("i").attr("class")
    $(this).parent().find("i").attr("class", klass.replace("blue", "gray"))

    $(this).parent().find("span.add-on").removeClass("focus")
    $(this).removeClass("focus-input")
  });

});
