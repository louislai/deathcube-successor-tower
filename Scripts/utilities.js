"use strict";
/*
 * Random next(max, min)
 */
var rand = function(min, max) {
	return ~~(Math.random() * (max - min) + min);
}

/* 
 * Graphic loop
 */
window.nextAnimationFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
		window.setTimeout(callback, 1000 / 300);
	};
})();

// Clone object
function deepCopy(o) {
  var cache = [];
  var c = JSON.stringify(o, function(key, value) {
      if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
          }
          // Store value in our collection
          cache.push(value);
      }

      if (!events.hasOwnProperty(key) 
        && key !== 'visual' && key !== 'frames' && key != 'image' && key != 'events')
        return value;

      return;
  });
  cache = null; // Enable garbage collection
  return JSON.parse(c);
}





