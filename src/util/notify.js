/* global chrome */

var defaultTimeout = 3000;

// Creates a notification and hides it after a bit.
// `error` will display a red icon, which signify errorneous messages.
window.notify = function(options) {
  var id = '' + ~~(Math.random() * 1e9);
  options.type = 'basic';
  options.iconUrl = 'img/' + (options.error ? 'red-' : '') + 'icon-48.png';
  setTimeout(function() {
    chrome.notifications.clear(id, function() {});
  }, options.timeout || defaultTimeout);
  delete options.error;
  delete options.timeout;
  chrome.notifications.create(id, options, function() {});
};
