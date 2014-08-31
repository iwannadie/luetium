var dom = window.dom = {};

// Returns true if `$el` is on screen.
dom.isOnScreen = function($el) {
  return $el.getBoundingClientRect().bottom <= window.innerHeight;
};

// Attaches an event listener to `$el` and throttles calling the
// `handler` as to not eat up too much CPU.
dom.throttleEvent = function($el, event, ms, handler) {
  var mayEmit = true;
  var lastEvent;

  function eventAvailable() {
    mayEmit = true;
    if (lastEvent) {
      handler(lastEvent);
    }
  }

  $el.addEventListener(event, function(e) {
    if (mayEmit) {
      mayEmit = false;
      lastEvent = null;
      handler(e);
      setTimeout(eventAvailable, ms);
    } else {
      lastEvent = e;
    }
  });
};

dom.createDiv = function(html) {
  var $div = document.createElement('div');
  $div.innerHTML = html;
  return $div;
};
