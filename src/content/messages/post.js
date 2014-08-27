/* global dom, strings */

window.Post = function($node) {
  var $top = this.$top = $node.children[0];
  var $message = this.$message = $node.getElementsByClassName('message')[0];

  // Separate the sig from the message.
  var messageHTML = $message.innerHTML;
  var belt = '\n---<br>\n';
  var beltp = messageHTML.lastIndexOf(belt);

  if (beltp > -1) {
    var $mws = this.$messageWithoutSig =
      dom.createDiv(messageHTML.slice(0, beltp));
    var $belt = this.$belt = dom.createDiv('---');
    var $sig = this.$sig =
      dom.createDiv(messageHTML.slice(beltp + belt.length));
    $message.innerHTML = '';
    $message.appendChild($mws);
    $message.appendChild($belt);
    $message.appendChild($sig);
  } else {
    this.$messageWithoutSig = $message;
  }

  var $userlink = $top.children[1];
  this.user = {
    $link: $userlink,
    ID: parseInt(strings.gup('user', $userlink.href), 10),
    name: strings.beforeLast($userlink.textContent, ' ('),
  };
};
