/* global storage */

(function() {
  var $head = document.getElementsByTagName('head')[0];
  var $style = document.createElement('style');
  $style.innerHTML =
    '.img-loaded { width: auto !important; height: auto !important; }\n' +
    '.img-loaded > img { max-width: 100%; height: auto; }\n';
  storage.get('messages.resize_imgs', function(enabled) {
    if (enabled) {
      $head.appendChild($style);
    } else {
      $head.removeChild($style);
    }
  });
})();
