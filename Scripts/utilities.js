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