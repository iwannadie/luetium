var ajax = window.ajax = {};

ajax.get = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 2 && xhr.status >= 300 ||
        xhr.readyState === 4) {
      callback(xhr);
    }
  };
  xhr.send();
  return xhr;
};

ajax.post = function(url, body, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 2 && xhr.status >= 300 ||
        xhr.readyState === 4) {
      callback(xhr);
    }
  };
  xhr.send(body);
  return xhr;
};
