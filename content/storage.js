/* global chrome */

(function() {
  var listeners = {};
  chrome.storage.onChanged.addListener(function(changes) {
    for (var key in changes) {
      var listener = listeners[key];
      if (listener) {
        listener(changes[key].newValue);
      }
    }
  });

  window.storage = {
    get: function(key, callback) {
      chrome.storage.sync.get(key, function(items) {
        callback(items[key]);
      });
      listeners[key] = callback;
    }
  };
})();
