(function() {
  var mySwiper;

  mySwiper = new Swiper('.swiper-container', {
    scrollContainer: true,
    mousewheelControl: true,
    mode: 'horizontal',
    scrollbar: {
      container: '.swiper-scrollbar',
      hide: false,
      draggable: true
    }
  });

}).call(this);

(function() {
  var Condition, initialSelect;

  window.conditionTemplate = null;

  Condition = {
    add: function() {
      var temporalTemplate;
      if (!window.conditionTemplate) {
        window.conditionTemplate = $('#template_condition');
      }
      temporalTemplate = window.conditionTemplate.clone();
      $('.js-insert-new-segment').prepend(temporalTemplate.html());
      $('.js-insert-new-segment .button-close').off('click', Condition.remove).on('click', Condition.remove);
      return initialSelect('.js-insert-new-segment .segment-item:first');
    },
    remove: function() {
      var box;
      box = $(this).parent();
      return box.slideUp(function() {
        return box.remove();
      });
    }
  };

  initialSelect = function(obj) {
    if (obj == null) {
      obj = 'body';
    }
    return $('.select-segment, .select-segment-is', obj).selectmenu({
      style: 'dropdown',
      maxHeight: 170,
      width: 190
    });
  };

  $(document).on('ready', function() {
    $('.js-add-condition').on('click', Condition.add);
    initialSelect();
    return $('#datepBox').datepicker();
  });

}).call(this);

(function() {
  var scrollTable;

  scrollTable = new Swiper('#round-corner', {
    scrollContainer: true,
    mousewheelControl: true,
    mode: 'horizontal',
    scrollbar: {
      container: '#round-corner-scrollbar',
      hide: false,
      draggable: true
    }
  });

}).call(this);
