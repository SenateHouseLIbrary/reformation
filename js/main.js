jQuery(document).ready(function(e){var t=e("#main"),a=e("#breadcrumb");if(e("body").hasClass("left-nav")){var n=e("#nav"),i=n.find(".menu-block-nav"),s=i.children(".menu"),l=parseInt(i.css("padding-left"),10),r=function(t,a,n){if(void 0===a&&(a=0),t.children("li").each(function(){var t=e(this);$a=t.children("a"),$a.wrapInner('<span class="menu-item"></span>');var n=t.children("ul");n.length>0&&($a.addClass("with-expander"),e("<span></span>").addClass("expander").text("Expand").appendTo($a),r(n,a+1,t))}),a>0){var i=n.clone().find("ul").remove().end().find(".expander").remove().end().find("a").addClass("current").end().prependTo(t);e("<span></span>").addClass("back").text("Back").prependTo(i.find("a"))}},d=function(e){void 0===e&&(e=!1);var t=i.width();i.find("ul").width(t),s.css("top",l).find("ul").css("left",t+l+l),c(e);var a=n.css("display");n.css({left:"9000px",display:"block"});var r=n.find("ul.active");i.height(r.outerHeight()),n.css({left:0,display:a}),n.css("top",v.position().top+v.outerHeight())},c=function(e){void 0===e&&(e=!1);var t,a=0;e?(t=s.find("a.active.current"),t.length||(t=s.find("a.active")),t.length?(s.removeClass("active").find("ul").removeClass("active"),t.closest("ul").addClass("active"),a=t.parents("ul").css("display","block").length-1):s.addClass("active")):(t=i.find("ul.active"),t.length&&(a=t.parents("ul").length));var n=s.css("transition-property");if(s.css("transition-property","none"),s.find("ul").css("transition-property","none"),a){var r=i.width();s.css("left",l-a*(r+l+l))}else s.css("left",l);s.css("transition-property",n),s.find("ul").css("transition-property",n)},o=function(){v.addClass("active"),f.addClass("active"),d(),n.show()},p=function(){v.removeClass("active"),f.removeClass("active"),n.hide()},v=e('<div id="nav-button-container"></div>');a.length?v.prependTo("#breadcrumb"):v.insertBefore(t);var f=e('<a href="#" id="nav-button">Nav</a>').appendTo(v);f.click(function(e){e.preventDefault(),n.is(":visible")?p():o()}),r(s),d(!0),s.find(".expander").click(function(t){t.preventDefault();var a=s.width(),n=e(this).parent().siblings("ul");n.addClass("active").css("display","block"),n.parent().closest("ul").removeClass("active");var r=parseInt(s.css("left"),10);s.css("left",r-a-l-l),i.height(n.outerHeight())}),s.find(".back").click(function(t){t.preventDefault();var a=s.width(),n=e(this).closest("ul").removeClass("active"),r=n.parent().closest("ul").addClass("active"),d=parseInt(s.css("left"),10);s.css("left",d+a+l+l),window.setTimeout(function(){n.css("display","none")},300),i.height(r.outerHeight())}),e(document).click(function(e){f.is(e.target)||s.is(e.target)||0!==s.has(e.target).length||p()})}var u=e(".node-gallery-item.node-teaser");u.length&&u.children("a.gallery-link").magnificPopup({type:"ajax",gallery:{enabled:!0}}),e(".img-link",".lightbox-image").magnificPopup({type:"image",gallery:{enabled:!0},image:{titleSrc:function(e){return e.el.parents("figure").find("figcaption").html()}}}),e(window).resize(function(){e(window).width()<309&&e("#visit-shl").text("SHL website"),p()}),e(window).resize()});