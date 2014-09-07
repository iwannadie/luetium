/* global chrome */

(function() {
  var listeners = {};
  chrome.storage.onChanged.addListener(function(changes) {
    for (var key in changes) {
      var newValue = changes[key].newValue;
      var listener = listeners[key];
      if (listener) {
        listener(newValue);
      }
      if (options) {
        options[key] = newValue;
      }
      localStorage.setItem('luetium', JSON.stringify(options));
    }
  });

  // An updated copy of options is kept in localStorage because
  // of its synchronous API. With things that affect styling,
  // it's important to be able to set this style right when the
  // content is loaded, or before, rather than witnessing
  // "jumpy" or "flashy" elements.
  var options = localStorage.getItem('luetium');
  if (options) {
    try {
      options = JSON.parse(options);
    } catch (err) {
      getStorage();
    }
  } else {
    getStorage();
  }

  function getStorage() {
    chrome.storage.sync.get(null, function(items) {
      options = items;
      localStorage.setItem('luetium', JSON.stringify(options));
    });
  }

  window.storage = {
    get: function(key, callback) {
      if (options && options[key]) {
        callback(options[key]);
      } else {
        chrome.storage.sync.get(key, function(items) {
          callback(items[key]);
        });
        getStorage();
      }
      listeners[key] = callback;
    }
  };
})();
