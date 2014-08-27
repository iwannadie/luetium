var strings = window.strings = {};

// Returns the number of times `token` is in `str`.
strings.count = function(str, token) {
  var n = 0;
  var p;
  while ((p = str.indexOf(token)) > -1) {
    n++;
    str = str.substring(p + token.length);
  }
  return n;
};

strings.beforeLast = function(str, needle) {
  var p;
  if ((p = str.lastIndexOf(needle)) > -1) {
    return str.slice(0, p);
  } else {
    return str;
  }
};

strings.afterLast = function(str, needle) {
  var p;
  if ((p = str.lastIndexOf(needle)) > -1) {
    return str.slice(p + needle.length);
  } else {
    return str;
  }
};

strings.betweenLast = function(str, from, to) {
  return strings.beforeLast(strings.afterLast(str, from), to);
};

// Gets URL part.
strings.gup = function(name, url) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  url = url || window.location.href;
  var results = new RegExp('[\\?&]'+name+'=?([^&#]*)').exec(url);
  return results === null ? null : results[1] || true;
};
