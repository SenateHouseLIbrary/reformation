jQuery('img[usemap]').mapify({
  hoverClass: 'mapify-clickable'
});
jQuery('area').on('click touchend', function(e) {
  var el = jQuery(this);
  var link = el.attr('href');
  window.location = link;
});
