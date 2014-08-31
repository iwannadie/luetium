/* global strings */

var myuser = window.myuser = {};

var $userbar = myuser.$bar = document.getElementsByClassName('userbar')[0];
var $userlink = myuser.$link = $userbar.children[0];
myuser.name = strings.beforeLast($userlink.textContent, ' (');
myuser.ID = parseInt(strings.gup('user', $userlink.href), 10);
