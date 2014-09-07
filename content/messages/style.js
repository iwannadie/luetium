/* global storage */

(function() {
  var $head = document.getElementsByTagName('html')[0];
  var $style = document.createElement('style');

  // This uses a painful hack to resize image placeholers to fit
  // the content width and keep the width/height ratio.
  //
  // http://www.mademyday.de/css-height-equals-width-with-pure-css.html
  $style.innerHTML =
    '.message-body .message .img-loaded {\n' +
    '  height: auto !important; }\n' +
    '.message-body .message .img-placeholder,\n' +
    '.message-body .message .img-loaded {\n' +
    '  position: relative;\n' +
    '  width: 100% !important; height: auto !important;\n' +
    '}\n' +
    '.message-body .message .img-placeholder:before,\n' +
    '.message-body .message .img-loaded:before {\n' +
    '  content: ""; display: block;\n' +
    '}\n' +
    '.message-body .message .imgs img {\n' +
    '  max-width: 100%; height: auto;\n' +
    '}\n' +
    '.message-body .message .img-placeholder img,\n' +
    '.message-body .message .img-loaded img {\n' +
    '  position: absolute; top: 0; right: 0; bottom: 0; left: 0;\n' +
    '}\n';

  storage.get('messages.resize_images', function(enabled) {
    if (enabled) {
      $head.appendChild($style);
    } else {
      $head.removeChild($style);
    }
  });
})();
