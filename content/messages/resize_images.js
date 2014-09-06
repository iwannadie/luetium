/* global chrome, storage */

(function() {
  var $head = document.getElementsByTagName('head')[0];
  var $style = document.createElement('style');

  var $script = window.$livelinks = document.createElement('script');
  $script.src = chrome.extension.getURL('overwriters/imageloader.js');
  $head.appendChild($script);

  storage.get('messages.resize_images', function(enabled) {
    if (enabled) {
      $head.appendChild($style);
    } else {
      $head.removeChild($style);
    }
  });

  var j = 0;
  window.resizeImages = function($container) {
    var $images = $container.getElementsByClassName('img-placeholder');
    for (var i = 0, len = $images.length; i < len; i++) {
      var $placeholder = $images[i];
      var width = parseInt($placeholder.style.width, 10);
      var height = parseInt($placeholder.style.height, 10);
      var ratio = height / width * 100;
      var id = 'luetium-image-' + (j++);
      $placeholder.classList.add(id);
      $style.innerHTML +=
        '.' + id + ' { max-width: ' + width + 'px; }\n' +
        '.' + id + ':before { padding-top: ' + ratio + '%; }\n';
        /*
        '.' + id + '.img-loaded:before, .' + id +'.img-loading:before {\n' +
        '  margin-top: -' + ratio + '%;\n' +
        '}\n';
        */
    }
  };
})();
