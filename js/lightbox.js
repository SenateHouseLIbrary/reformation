//
// Lightbox
//
jQuery(document).ready(function($) {
  $('.node-type-blog-post').imagesLoaded(function() {
    $('a[href$=".gif"], a[href$=".jpeg"], a[href$=".jpg"], a[href$=".png"]')
      .children('img')
      .each(function() {
        var $img = $(this);
        var classes = $img.attr('class');
        if (typeof classes === 'undefined') {
          classes = '';
        }
        $img
          .attr('class', 'lightbox-enabled')
          .parent()
          .wrap('<div class="lightbox-image ' + classes + '"></div>')
          .prepend('<span></span>')
          .parent()
          .width($img.width());
        if ($img.parents('figure').length) {
          $img.parent().magnificPopup({
            type: 'image',
            image: {
              titleSrc: function(item) {
                return item.el
                  .parents('figure')
                  .find('figcaption')
                  .html();
              }
            }
          });
        } else {
          $img.parent().magnificPopup({
            type: 'image'
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
      });
  });
});

// /*
//   var S = a(".view-new-acquisitions");
//   S.imagesLoaded(function() {
//       S.masonry({
//           itemSelector: ".node-new-acquisition",
//           gutterWidth: 16
//       })
//   }), a("#page").imagesLoaded(function() {
//       a('a[href$=".gif"], a[href$=".jpeg"], a[href$=".jpg"], a[href$=".png"]').children("img").each(function() {
//           var b = a(this),
//               c = b.attr("class");
//           "undefined" == typeof c && (c = ""), b.attr("class", "lightbox-enabled").parent().wrap('<div class="lightbox-image ' + c + '"></div>').prepend("<span></span>").parent().width(b.width()), b.parents("figure").length ? b.parent().magnificPopup({
//               type: "image",
//               image: {
//                   titleSrc: function(a) {
//                       return a.el.parents("figure").find("figcaption").html()
//                   }
//               }
//           }) : b.parent().magnificPopup({
//               type: "image"
//           })
//           a('.img-link').magnificPopup({
//               type: 'image',
//               gallery: {
//                   enabled: !0,
//               },
//               image: {
//                   titleSrc: function(item) {
//                       return item.el.parents("figure").find("figcaption").html()
//                   }
//               }
//           })
//       })
//   });
//   */
