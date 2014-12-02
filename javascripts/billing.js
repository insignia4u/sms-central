
$(".level1 input").click(function (){
    $(".level1").removeClass('active');
    $(this).parents('.level1').addClass('active');
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

