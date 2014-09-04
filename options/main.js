/* global chrome, $ */

var $menu = $('#main-menu');
var $mainview = $('.mainview');

function menuClick(ev) {
  ev.preventDefault();

  $('.mainview > *').removeClass('selected');
  $('.menu li').removeClass('selected');
  setTimeout(function() {
    $('.mainview > *:not(.selected)').css('display', 'none');
  }, 100);

  var $target = $(ev.currentTarget);
  $target.parent().addClass('selected');
  var currentView = $($target.attr('href'));
  currentView.css('display', 'block');
  setTimeout(function() {
    currentView.addClass('selected');
  }, 0);

  setTimeout(function() {
    $('body')[0].scrollTop = 0;
  }, 200);
}

$('.menu a').click(menuClick);
$('.mainview > *:not(.selected)').css('display', 'none');

var firstTab = true;
window.addTab = function(name, desc, options) {
  if (!options) {
    options = desc;
    desc = null;
  }
  var keyName = name.toLowerCase().replace(' ', '_');
  var $menuButton = $('<li><a href="#' + keyName + '">' + name + '</a></li>');
  $menuButton.find('a').click(menuClick);
  $menuButton.appendTo($menu);
  var $tabview = $('<div id="' + keyName + '">' +
    '<header><h1></h1></header>' +
    '</div>');
  if (firstTab) {
    firstTab = false;
    $menuButton.addClass('selected');
    $tabview.addClass('selected');
  } else {
    $tabview.css('display', 'none');
  }
  $tabview.find('header > h1').text(name);
  var $tabcontent = $('<div class="content"></div>');
  if (desc) {
    $tabcontent.append($('<p></p>').text(desc));
  }
  addOptions($tabcontent, keyName, options);
  $tabcontent.appendTo($tabview);
  $tabview.appendTo($mainview);
};

function addOptions($parent, parentKey, options) {
  var keys = {};

  for (var i = 0, len = options.length; i < len; i++) {
    var option = options[i];
    var key = parentKey + '.' + option.name;
    keys[key] = option.default || null;
    switch (option.type) {
      case 'checkbox':
        addCheckbox($parent, key, option);
    }
  }
}

function addCheckbox($parent, key, option) {
  var $container = $('<div class="checkbox"><label></label></div>');
  var $label = $container.find('label');
  var $checkbox = $('<input type="checkbox">');
  $checkbox.appendTo($label);
  $('<span></span>')
    .text(option.desc)
    .appendTo($label);
  $container.appendTo($parent);

  $checkbox.click(function() {
    var checked = $checkbox[0].checked;
    var items = {};
    items[key] = checked;
    chrome.storage.sync.set(items);
  });

  chrome.storage.sync.get(key, function(items) {
    $checkbox[0].checked = items[key];
  });
}
