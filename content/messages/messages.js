/* global Post, resizeImages */

(function() {
  window.processPost = function(post) {
    resizeImages(post.$message);
  };

  var $messages = document.getElementsByClassName('message-container');
  for (var i = 0, len = $messages.length; i < len; i++) {
    window.processPost(new Post($messages[i]));
  }
})();
