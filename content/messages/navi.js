/* global storage, $livelinks */

(function() {
  var playing = false;
  var pocketed = true;
  var timeoutID;
  var pocketTimeout = 15000;
  var audio = new Audio();
  var path = 'https://static.endoftheinter.net/navi/';
  var sounds = ['hello', 'hey', 'listen', 'look', 'watchout'];
  var lastPlayed;
  var queue = [];
  var enabled = false;

  storage.get('messages.navi', function(value) {
    enabled = value;
  });

  function playSound(sound) {
    if (!enabled) { return; }
    if (playing) {
      queue.push(sound);
    } else {
      audio.onended = function() {
        playing = false;
        var sound = queue.shift();
        if (sound) {
          playSound(sound);
        }
      };
      audio.src = path + sound + '.mp3';
      audio.play();
      playing = true;
    }
  }

  function removeFromPocket() {
    pocketed = false;
    playSound('out');
  }

  function returnToPocket() {
    pocketed = true;
    playSound('in');
  }

  $livelinks.addEventListener('new-post-count-after', function() {
    if (!enabled) { return; }
    if (pocketed) {
      removeFromPocket();
    }
    var sound;
    do {
      sound = sounds[~~(Math.random() * sounds.length)];
    } while (sound === lastPlayed);
    lastPlayed = sound;
    playSound(sound);
    clearTimeout(timeoutID);
    timeoutID = setTimeout(returnToPocket, pocketTimeout);
  });
})();
