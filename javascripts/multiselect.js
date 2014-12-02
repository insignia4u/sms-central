 $(document).ready(function(){
  enableAddTags();
  enableRemoveTags();
});

function enableAddTags() {
  $(".unstyled.items li a").live("click",function (e) {
    e.preventDefault();
    var newHtml = "<li>"+
      "<a href='#'>"+$(this).html()+
      "<i class='icon-remove-small-white'></i>"+
      "</a>"+
      "</li>";

    $(this).parent().remove();

    $(".unstyled.selected").append(newHtml);

    e.stopPropagation;
    return false;
  })
}

function enableRemoveTags() {
  $(".unstyled.selected li a").live("click",function (e) {
    e.preventDefault();
    $(this).find("i").remove()
    var newHtml = "<li>"+
      "<a href='#'>"+$(this).html()+"</a>"+
      "</li>";

    $(this).parent().remove();

    $(".unstyled.items").append(newHtml);

    e.stopPropagation;
    return false;
  })
}
