 $(document).ready(function(){
  enableAddTags();
  enableRemoveTags();
});

function enableAddTags() {

  $(".unstyled.items li a").die('click');

  $(".unstyled.items li a").live("click",function (e) {
    e.preventDefault();

/*
    li_id = $(this).parent().attr('id');
    add_id = "";
    if (li_id != '')
    	add_id = ' id="'+li_id+'" ';
    var newHtml = "<li "+add_id+">"+
      "<a href='"+$(this).attr('href')+"'>"+$(this).html()+
      "<i class='icon-remove-small-white'></i>"+
      "</a>"+
      "</li>";
*/

	$(this).append("<i class='icon-remove-small-white'></i>");	
	

    $(this).parents('.multiple-selection').find(".unstyled.selected").append($(this).parent('li'));
//    $(this).parent().remove();


    e.stopPropagation;
    return false;
  })
  
}

function enableRemoveTags() {

  $(".unstyled.selected li a").die('click');
  
  $(".unstyled.selected li a").live("click",function (e) {
    e.preventDefault();
    
    $(this).find("i").remove();
 /*   
    li_id = $(this).parent().attr('id');
    add_id = "";
    if (li_id != '')
    	add_id = ' id="'+li_id+'" ';
    var newHtml = "<li "+add_id+">"+
      "<a href='#'>"+$(this).html()+"</a>"+
      "</li>";
*/

    $(this).parents('.multiple-selection').find(".unstyled.items").append($(this).parent('li'));

//    $(this).parent().remove();


    e.stopPropagation;
    return false;
  })
  
}
