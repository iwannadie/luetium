/* global chrome, storage, notify, ajax */

// Creates a menu that will only show up when the user right clicks
// on an image. Primarily used for uploading images from other sites to ETI.
var menu;
storage.get('general.transloader', function(enabled) {
  if (enabled) {
    menu = chrome.contextMenus.create({
      title: 'luetium',
      contexts: ['image']
    });

    chrome.contextMenus.create({
      title: 'Transload image',
      parentId: menu,
      onclick: transloadit,
      contexts: ['image']
    });
  } else if (menu) {
    chrome.contextMenus.remove(menu);
  }
});

var etiRegexp = /^https?:\/\/i\d+\.endoftheinter\.net\/i\/n\//;
var facebookRegexp = /fbcdn\-sphotos/;
var uploadUrl = 'http://u.endoftheinter.net/u.php';
var maxSize = 1024 * 1024 * 2;
/* jshint maxlen:false */

function transloadit(image) {
  // If the image is already hosted on ETI,
  // skip uploading and put the img code into the user's clipboard.
  // Note that this still uploads thumbnails.
  if (etiRegexp.test(image.srcUrl)) {
    pbcopy('<img src="' + image.srcUrl + '" />');
    notify({
      title: 'Image Copied',
      message: 'The image code has been copied to your clipboard'
    });
    return;
  }

  var filename = image.srcUrl.substring(image.srcUrl.lastIndexOf('/') + 1);
  var ext = filename.substring(filename.lastIndexOf('.') + 1);

  // Hide images uploaded from facebook.
  if (facebookRegexp.test(filename)) {
    filename = 'fb.' + ext;
  }

  // In case it's empty.
  filename = filename || 'something.jpg';

  // Download the image.
  var download = ajax.get(image.srcUrl, function(download) {
    if (download.status >= 300) {
      download.abort();
      notifyError('There was an error downloading the image');
      return;
    }

    if (download.getResponseHeader('Content-Length') > maxSize) {
      download.abort();
      notifyError('Image can\'t be over 2MB');
      return;
    }

    if (download.response.byteLength > maxSize) {
      notifyError('Image can\'t be over 2MB');
      return;
    }

    var blob = new Blob([new DataView(download.response)]);
    var form = new FormData();
    form.append('file', blob, filename);
    ajax.post(uploadUrl, form, function(upload) {
      if (upload.status >= 300) {
        notifyError('There was an error uploading the image');
        return;
      }

      var findLinkRegexp = new RegExp(
        '&quot;(http:\\/\\/i\\d+\\.endoftheinter\\.net\\/i\\/n\\/' +
        '[a-z0-9]+\\/' + filename + ')&quot;');
      var rs = findLinkRegexp.exec(upload.responseText);
      if (!rs) {
        notifyError('There was an error uploading the image');
        return;
      }

      pbcopy('<img src="' + rs[1] + '" />');
      notify({
        title: 'Transload success',
        message: 'Image code copied to clipboard'
      });
    });
  });
  download.responseType = 'arraybuffer';
}

function notifyError(message) {
  notify({ title: 'Transload error', message: message, error: true });
}

// Create a textarea in the background page to use it to
// copy text into the user's clipboard.
var background = chrome.extension.getBackgroundPage().document;
var $clipboard = background.createElement('textarea');
background.body.appendChild($clipboard);

function pbcopy(str) {
  $clipboard.value = str;
  $clipboard.select();
  document.execCommand('copy');
}
