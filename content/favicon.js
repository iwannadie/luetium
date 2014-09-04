/* global Favico, storage */
/* jshint maxlen: false */

// Replace the favicon with its data URI.
// This bypassed security restrictions so that
// Favico can be used.
var $head = document.getElementsByTagName('head')[0];
var $link = $head.getElementsByTagName('link')[0];
$link.href = 'data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAKSSP/IJ8d/yqxHv/j6ef//////1xYRv8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxYRv+Ggof/paSt/8LFyv/Cxcr/XFhG/1xYRv9cWEb/XFhG/1xYRv8AAAAAAAAAAAAAAAAAAAAAAAAAAFxYRv+Ggof/paSt/8XGzv/Cxcr/wsXK/8LFyv/Cxcr/wsXK/8LFyv/Cxcr/XFhG/1xYRv8AAAAAAAAAAAAAAACGgof/paSt/8LFyv/j6ef/wsXK/wpJI/8KSSP/Ckkj/8LFyv/Cxcr/wsXK/8LFyv8KSSP/Ckkj/wAAAAAAAAAAhoKH/8LFyv/j6ef/wsXK/wpJI/8gnx3/IJ8d/yCfHf8KSSP/Ckkj/wpJI/8KSSP/IJ8d/yCfHf8KSSP/AAAAAIaCh//j6ef/wsXK/wpJI/8gnx3/IJ8d/yCfHf8gnx3/IJ8d/yCfHf8gnx3/IJ8d/yCfHf8gnx3/IJ8d/wpJI/+Ggof/paSt/wpJI/8gnx3/IJ8d/yCfHf8gnx3/IJ8d/yCfHf8gnx3/IJ8d/yCfHf8gnx3/IJ8d/yqxHv8KSSP/hoKH/6Wkrf8KSSP/KrEe/yCfHf8gnx3/IJ8d/yCfHf8gnx3/IJ8d/yCfHf8gnx3/IJ8d/yqxHv8sxin/Ckkj/yt0Kf8PhAf/LMYp/yqxHv8gnx3/IJ8d/yCfHf8gnx3/IJ8d/yCgHf8gnx3/Ckkj/yqxHv8KSSP/M9w0/wpJI/8KSSP/D4QH/yzGKf8sxin/KrEe/yCfHf8gnx3/IJ8d/yCfHf8gnx3/Ckkj/yqxHv8sxin/M9w0/wpJI/8AAAAAAARL/wpJI/8z3DT/M9w0/wpJI/8KSSP/Ckkj/yCfHf8foBz/KrEe/yqxHv8qsR7/LMYp/zPcNP8KSSP/AAAAAAAAAAAKSSP/IJ8d/zPcNP8z3DT/LMYp/yzGKf8KSSP/Ckkj/wpJI/8KSSP/Ckkj/wpJI/8KSSP/AAAAAAAAAAAAAAAACkkj/yCfHf//////AAAA/yzGKf8sxin/LMYp/yCfHf//////AAAA/wpJI/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKSSP/Ckkj/wpJI/8KSSP/LMYp/yzGKf8KSSP/Ckkj/wpJI/8KSSMOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApJI/8gnx3/KrEe/yzGKf8sxin/LMYp/wpJI/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACkkj/wpJI/8KSSP/Ckkj/wpJI/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/90coAfZz4ABwkJAANleQABb20AAHBwAAAucAAAbnQAAGljAAF0LgABZW2AA3JhgA8va8APPgrgPwk88H9yYQ==';

var favico = new Favico({ bgColor: '#006dff', animation: 'none' });
var unseen = 0;
var updating = false;
var updatePending = false;
var enabled = false;

// Make sure not to update the favicon too frequently.
// Otherwise, Favico errors out and won't update it anymore.
function setBadge(n) {
  if (!updating) {
    favico.badge(n);
    updating = true;
    setTimeout(function() {
      updating = false;
      if (updatePending) {
        updatePending = false;
        setBadge(unseen);
      }
    }, 700);
  } else {
    updatePending = true;
  }
}

storage.get('messages.update_favicon', function(value) {
  enabled = value;
  setBadge(enabled ? unseen : 0);
});

window.favicon = {
  inc: function(n) {
    unseen += n || 1;
    if (enabled) {
      setBadge(unseen);
    }
  },
  dec: function(n) {
    unseen -= n || 1;
    if (enabled) {
      setBadge(unseen);
    }
  },
};
