(function() {
  $(document).on('ready', function() {
    return window.mySwiper = new Swiper('.swiper-container', {
      scrollContainer: true,
      mousewheelControl: true,
      mode: 'horizontal',
      simulateTouch: true,
      resistance: '100%',
      onSwiperCreated: function() {
        window.swiperCreated = true;
        if (($('.scroll-container').length)) {
          return $('.main-column').before($('.tablesaw-bar.mode-columntoggle'));
        }
      },
      scrollbar: {
        container: '.swiper-scrollbar',
        hide: false,
        draggable: true,
        simulateTouch: true
      }
    });
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
  var showOption;

  this.listItems = [];

  showOption = function() {
    var itemToShow;
    itemToShow = $(this).data('show');
    $.each(listItems, function(index, val) {
      return $(val).not(itemToShow).hide();
    });
    return $(itemToShow).show();
  };

  $(document).on('ready', function() {
    $("[data-show]").each(function() {
      var item;
      item = $(this).data('show');
      return listItems.push(item);
    });
    $.each(listItems, function(index, val) {
      return $(val).hide();
    });
    $(listItems[0]).show();
    return $('.js-show-options input').on('click', showOption);
  });

}).call(this);

(function() {
  $(document).on('ready', function() {
    $('.js-btn-skip').on('click', function() {
      var parent;
      parent = $(this).closest('.column');
      $('.control-group-box', parent).addClass('s-hidden');
      return $('.js-box-skip', parent).removeClass('s-hidden');
    });
    $('.js-btn-save').on('click', function() {
      var parent;
      parent = $(this).closest('.column');
      $('.control-group-box', parent).addClass('s-hidden');
      return $('.js-box-save', parent).removeClass('s-hidden');
    });
    return $('.js-btn-edit').on('click', function() {
      var parent;
      parent = $(this).closest('.column');
      $('.control-group-box', parent).addClass('s-hidden');
      return $('.js-box-edit', parent).removeClass('s-hidden');
    });
  });

}).call(this);

(function() {


}).call(this);
