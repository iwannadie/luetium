/* global ImageLoader */

// This is used to add classes to image loaders without removing all
// other classes. `Element#classList` is used.
ImageLoader.doneHandler = function(img) {
  if (img in ImageLoader.loading) {
    var classList = ImageLoader.loading[img].dom.classList;
    classList.add('img-loaded');
    classList.remove('img-placeholder');
    delete ImageLoader.loading[img];
    ++ImageLoader.loadingSlots;
  }
};

ImageLoader.prototype.load = function() {
  delete ImageLoader.instances[this.instance];
  ImageLoader.loading[this.instance] = this;
  --ImageLoader.loadingSlots;
  var $img = document.createElement('img');
  this.img = $img;
  $img.onload = ImageLoader.doneHandler.bind(null, this.instance);
  $img.onerror = this.fallBack.bind(this);
  $img.src = this.src;
  $img.width = this.width;
  $img.height = this.height;
  this.dom.appendChild($img);
  for (var c in ImageLoader.instances) {
    if (ImageLoader.instances[c].src === this.src) {
      var $copy = $img.cloneNode(false);
      ImageLoader.instances[c].img = $copy;
      $copy.onload = function() {
        var classList = this.classList;
        classList.add('img-loaded');
        classList.remove('img-placeholder');
      }.bind(ImageLoader.instances[c].dom);
      $copy.onerror = this.fallBack.bind(ImageLoader.instances[c]);
      ImageLoader.instances[c].dom.appendChild($copy);
      delete ImageLoader.instances[c];
    }
  }
};

ImageLoader.prototype.fallBack = function() {
  var src = this.img.src.replace('dealwith.it', 'endoftheinter.net');
  if (src !== this.img.src) {
    this.img.src = src;
  }
  var classList = this.dom.classList;
  classList.add('img-loaded');
  classList.remove('img-placeholder');
  ImageLoader.doneHandler(this.instance);
};
