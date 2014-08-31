/* global TopicManager, Ajax, Navi, DOM */

var $livelinks = document.getElementById('livelinks');

// Replace this function on the TopicManager for a few reasons
//   * To notify contents scripts of
//     * an updated `newCount`.
//     * new messages
//   * Fixes a bug with `pendingUpdate` being checking incorrectly.
//     If this function is called too frequently, a message may not show up
//     on the page because a request to `/moremessages.php` is already
//     under way.
TopicManager.prototype.updateMessages = function(newCount) {
  var event = new CustomEvent('new-post-count', { detail: newCount });
  $livelinks.dispatchEvent(event);

  if (this.pendingUpdate) {
    // Don't make a request if there's already a pending one.
    // We could consider making subsequent requests run in parallel too.
    this.pendingMessages = newCount;
    return;
  } else {
    this.pendingMessages = 0;
  }

  this.pagers.invoke('setRows', newCount);
  var pager = this.pagers[0];
  var maxMessages = Math.min(pager.getPage() * pager.perPage, newCount);
  if (maxMessages <= newCount) {
    var currentPage = maxMessages > this.messages;
    var self = this;
    Ajax('/moremessages.php?' +
      (this.isTopic ? 'topic=' : 'pm=') + this.id +
      '&old=' + this.messages + '&new=' + maxMessages +
      '&filter=' + this.filter
    ).onsuccess(function(data) {
      if (data) {
        if (currentPage) {
          /* jshint evil: true */
          var $tmp = document.createElement('div');
          $tmp.innerHTML = data;
          DOM.eval(self.dom.appendChild($tmp));
          (function() { Navi.singleton().notify(); }).defer();
        }
        var $viewers = document.getElementById('topic_viewers_update');
        if ($viewers) {
          self.viewers.innerHTML = $viewers.innerHTML;
          $viewers.parentNode.removeChild($viewers);
        }
      }
      self.pendingUpdate = false;
      if (self.pendingMessages) {
        self.updateMessages(self.pendingMessages);
      }
    }).send();
    this.pendingUpdate = true;

    if (!currentPage) {
      $livelinks.dispatchEvent(new CustomEvent('new-page-post', {
        detail: newCount - this.messages
      }));
      (function() { Navi.singleton().notify(); }).defer();
    }
  }
  this.messages = newCount;
};

/* jshint evil: true */
var oldeval = DOM.eval;
DOM.eval = function($node) {
  // This function is called by the TopicManager whenever a new message
  // comes in through livelinks, and from quickpost on preview and on post.
  if ($node.parentNode.id === 'u0_1' && $node.childNodes.length) {
    // Can't pass dom node over custom events, so pass the ID.
    var $posts = $node.getElementsByClassName('message-container');
    for (var i = 0, len = $posts.length; i < len; i++) {
      $livelinks.dispatchEvent(new CustomEvent('new-post', {
        detail: $posts[i].id
      }));
    }
  }
  oldeval.call(DOM, $node);
};