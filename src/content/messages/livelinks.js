/* global chrome, dom, Post, myuser, favicon */

// This script needs to be injected into the page with a script tag
// because content scripts are sandboxed, they don't get access
// to the window.
var $livelinks = document.createElement('script');
$livelinks.src = chrome.extension.getURL('src/content/messages/navi.js');

// The element will be used as a bridge between content scripts and
// the actual window. Events will fire from it signaling new posts.
$livelinks.id = 'livelinks';
document.getElementsByTagName('head')[0].appendChild($livelinks);

// Add sound player, for some reason this is not in `inboxthread.php`.
var $sound = document.createElement('audio');
$sound.id = 'sound_player';
document.body.appendChild($sound);

var unseenPosts = [];

$livelinks.addEventListener('new-post', function(e) {
  var id = e.detail;
  var $node = document.getElementById(id);
  var post = new Post($node);

  // Whenever there's a new post, check that it does not belong
  // to the current user, and if either
  //   * page is not hidden
  //   * post is not currently on screen
  // If so, increase the count on the favicon until this post is seen.
  var $message = post.$messageWithoutSig;
  if (myuser.ID !== post.user.ID &&
     (!document.hidden || !dom.isOnScreen($message))) {
    favicon.inc();
    unseenPosts.push($message);
  }
});

function checkUnseenPosts() {
  if (!unseenPosts.length) { return; }
  var $currPost;
  while ($currPost = unseenPosts[0]) {
    if (dom.isOnScreen($currPost)) {
      unseenPosts.splice(0, 1);
      favicon.dec();
    } else {
      // If an older post is not on screen, neither is a newer one.
      return;
    }
  }
}

dom.throttleEvent(window, 'scroll', 100, checkUnseenPosts);
window.addEventListener('focus', checkUnseenPosts);

// Always increase the favicon count if the posts are from other pages.
$livelinks.addEventListener('new-page-post', function(e) {
  favicon.inc(e.detail);
});
