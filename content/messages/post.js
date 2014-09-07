/* global dom, strings */

window.Post = function($node) {
  var $top = this.$top = $node.children[0];
  var $message = this.$message = $node.getElementsByClassName('message')[0];

  // Separate the sig from the message.
  var $children = $message.childNodes;
  var br = 0;
  var sigIndex = -1;
  for (var i = $children.length - 1; i >= 0 && br <= 3; i--) {
    var $n = $children[i];
    if ($n.tagName === 'BR') {
      br++;
    } else if ($n.nodeType === 3 && $n.nodeValue.trim() === '---') {
      sigIndex = i;
    }
  }

  if (sigIndex > -1) {
    var $mws = this.$messageWithoutSig = dom.createDiv('');
    $mws.className = 'luetium-message';
    for (i = 0; i < sigIndex; i++) {
      $mws.appendChild($children[0]);
    }

    var $belt = this.$belt = dom.createDiv('<div></div>');
    $belt.className = 'secret';
    $belt.firstChild.className = 'luetium-belt';
    $belt.children[0].appendChild($children[0]);
    $message.removeChild($children[0]);

    var $sig = this.$sig = dom.createDiv('<div></div>');
    $sig.className = 'secret';
    $sig.firstChild.className = 'luetium-sig';
    for (i = $children.length - 1; i >= 0; i--) {
      $sig.children[0].appendChild($children[0]);
    }

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
