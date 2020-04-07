jQuery(document).ready(function($) {
  var titleCase = ['the', 'to', 'and', 'or', 'nor'];
  var titleCaseSelector =
    '#main-menu-links a, #block-shl-featured-exhibition header h2';
  var $main = $('#main');
  var $breadcrumb = $('#breadcrumb');
  //var galleryAjaxPath = Drupal.settings.basePath + 'ajax/gallery-item/';
  var throbber =
    '<div class="ajax-progress"><div class="throbber"></div></div>';
  var monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  // Preload gif
  // var wheel = new Image();
  // wheel.src =
  //   Drupal.settings.basePath + 'sites/all/themes/shlm_theme/images/wheel.gif';

  //
  // Left hand pop out nav
  //
  if ($('body').hasClass('left-nav')) {
    var $nav = $('#nav');
    var $navBlock = $nav.find('.menu-block-nav');
    var $navMenu = $navBlock.children('.menu');
    var navPadding = parseInt($navBlock.css('padding-left'), 10);

    // Recursively add the expanders and back buttons
    var addExpanders = function($ul, level, $previousListItem) {
      if (typeof level == 'undefined') {
        level = 0;
      }

      $ul.children('li').each(function() {
        var $li = $(this);
        $a = $li.children('a');
        $a.wrapInner('<span class="menu-item"></span>');
        var $subMenu = $li.children('ul');
        if ($subMenu.length > 0) {
          $a.addClass('with-expander');
          $('<span></span>')
            .addClass('expander')
            .text('Expand')
            .appendTo($a);
          addExpanders($subMenu, level + 1, $li);
        }
      });

      if (level > 0) {
        var $backLink = $previousListItem
          .clone()
          .find('ul')
          .remove()
          .end()
          .find('.expander')
          .remove()
          .end()
          .find('a')
          .addClass('current')
          .end()
          .prependTo($ul);
        $('<span></span>')
          .addClass('back')
          .text('Back')
          .prependTo($backLink.find('a'));
      }
    };

    var setNavSizes = function(reset) {
      if (typeof reset == 'undefined') {
        reset = false;
      }

      var navWidth = $navBlock.width();
      $navBlock.find('ul').width(navWidth);
      $navMenu
        .css('top', navPadding)
        .find('ul')
        .css('left', navWidth + navPadding + navPadding);

      setNavContext(reset);

      var oldDisplay = $nav.css('display');
      $nav.css({
        left: '9000px',
        display: 'block'
      });
      var $activeUl = $nav.find('ul.active');
      $navBlock.height($activeUl.outerHeight());
      $nav.css({
        left: 0,
        display: oldDisplay
      });

      $nav.css(
        'top',
        $navButtonContainer.position().top + $navButtonContainer.outerHeight()
      );
    };

    var setNavContext = function(reset) {
      if (typeof reset == 'undefined') {
        reset = false;
      }

      var depth = 0;
      var $currentMenuEntry;

      if (reset) {
        $currentMenuEntry = $navMenu.find('a.active.current');
        if (!$currentMenuEntry.length) {
          $currentMenuEntry = $navMenu.find('a.active');
        }

        if ($currentMenuEntry.length) {
          $navMenu
            .removeClass('active')
            .find('ul')
            .removeClass('active');
          $currentMenuEntry.closest('ul').addClass('active');
          depth =
            $currentMenuEntry.parents('ul').css('display', 'block').length - 1;
        } else {
          $navMenu.addClass('active');
        }
      } else {
        $currentMenuEntry = $navBlock.find('ul.active');

        if ($currentMenuEntry.length) {
          depth = $currentMenuEntry.parents('ul').length;
        }
      }

      var savedTransition = $navMenu.css('transition-property');
      // Disable transitions because when this gets called on resize we don't
      // want to see stuff flying around
      $navMenu.css('transition-property', 'none');
      $navMenu.find('ul').css('transition-property', 'none');
      if (depth) {
        var navWidth = $navBlock.width();
        $navMenu.css(
          'left',
          navPadding - depth * (navWidth + navPadding + navPadding)
        );
      } else {
        $navMenu.css('left', navPadding);
      }
      $navMenu.css('transition-property', savedTransition);
      $navMenu.find('ul').css('transition-property', savedTransition);
    };

    var showNav = function() {
      $navButtonContainer.addClass('active');
      $navButton.addClass('active');
      setNavSizes();
      $nav.show();
    };

    var hideNav = function() {
      $navButtonContainer.removeClass('active');
      $navButton.removeClass('active');
      $nav.hide();
    };

    var $navButtonContainer = $('<div id="nav-button-container"></div>');
    if ($breadcrumb.length) {
      $navButtonContainer.prependTo('#breadcrumb');
    } else {
      $navButtonContainer.insertBefore($main);
    }
    var $navButton = $('<a href="#" id="nav-button">Nav</a>').appendTo(
      $navButtonContainer
    );
    $navButton.click(function(e) {
      e.preventDefault();
      if ($nav.is(':visible')) {
        hideNav();
      } else {
        showNav();
      }
    });

    // Set up nav
    addExpanders($navMenu);
    setNavSizes(true);

    $navMenu.find('.expander').click(function(e) {
      e.preventDefault();
      var navMenuWidth = $navMenu.width();

      var $targetUl = $(this)
        .parent()
        .siblings('ul');
      $targetUl.addClass('active').css('display', 'block');

      $targetUl
        .parent()
        .closest('ul')
        .removeClass('active');

      var oldLeft = parseInt($navMenu.css('left'), 10);
      $navMenu.css('left', oldLeft - navMenuWidth - navPadding - navPadding);

      $navBlock.height($targetUl.outerHeight());
    });

    $navMenu.find('.back').click(function(e) {
      e.preventDefault();
      var navMenuWidth = $navMenu.width();

      var $goneUl = $(this)
        .closest('ul')
        .removeClass('active');
      var $targetUl = $goneUl
        .parent()
        .closest('ul')
        .addClass('active');

      var oldLeft = parseInt($navMenu.css('left'), 10);
      $navMenu.css('left', oldLeft + navMenuWidth + navPadding + navPadding);
      window.setTimeout(function() {
        $goneUl.css('display', 'none');
      }, 300);

      $navBlock.height($targetUl.outerHeight());
    });

    $(document).click(function(e) {
      if (
        !$navButton.is(e.target) &&
        !$navMenu.is(e.target) &&
        $navMenu.has(e.target).length === 0
      ) {
        hideNav();
      }
    });
  }

  //
  // Gallery
  //
  var $galleryItems = $('.node-gallery-item.node-teaser');
  if ($galleryItems.length) {
    $galleryItems.children('a.gallery-link').magnificPopup({
      type: 'ajax',
      gallery: {
        enabled: true
      }
      // callbacks: {
      //   elementParse: function(item) {
      //     // Rewrite the src to use the AJAX path
      //     item.src = galleryAjaxPath + $(item.el[0]).data('nid');
      //   }
      // }
    });
  }

  $('.img-link', '.lightbox-image').magnificPopup({
    type: 'image',
    gallery: {
      enabled: true
    },
    image: {
      titleSrc: function(item) {
        return item.el
          .parents('figure')
          .find('figcaption')
          .html();
      }
    }
  });

  $(window).resize(function() {
    if ($(window).width() < 309) {
      $('#visit-shl').text('SHL website');
    }
    hideNav();
  });

  $(window).resize();
});
