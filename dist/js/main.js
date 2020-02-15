"use strict";

var header = function header() {
  console.log('header');
};
"use strict";

$('#view-work').on('click', function () {
  var images = $('#images').position().top;
  $('html, body').animate({
    scrollTop: images
  }, 900);
});
//# sourceMappingURL=main.js.map
