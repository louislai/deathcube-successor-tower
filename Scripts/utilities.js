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
		window.setTimeout(callback, 1000 / 60);
	};
})();


/*
 * Define AIUnit Class
 * Using JediScript
 */

function AIUnit(type, time) {
  var type = type;
  var time = time;
  this.getType = function() {
    return type;
  };
  this.getTime = function() {
    return time;
  };
}

/*
 * Define AITower Class
 * Using JediScript
 */

function AITower(type, pt) {
  var coordinates = pt;
  var type = type;
  this.getType = function() {
    return type;
  };
  this.getCoordinates = function() {
    return coordinates
  }
}


