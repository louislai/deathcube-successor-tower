"use strict";
/*
 * The VIEW and implementations of it
 */
var View = Class.extend({
	init: function(width, height) {
		this.running = false;
		this.visuals = [];
		this.background = undefined;
		this.width = width || 300;
		this.height = height || 200;
		this.showGrid = true;
		this.mazeSize = new Size(25, 25);
	},
	pause: function() {
		this.running = false;	
	},
	add: function(visual) {
		if (Array.isArray(visual)) {
			for (var i = 0, n = visual.length; i < n; ++i)
				this.visuals.push(visual[i]);
		} else
			this.visuals.push(visual);

		this.visuals.sort(function(a, b) {
			return a.z - b.z;
		});
	},
	remove: function(visual) {
		var index = this.visuals.indexOf(visual);
		this.visuals.splice(index, 1);
	},
	draw: function() {
		this.drawBackground();
		this.drawSpawn();
		this.drawHome();

		if (this.showGrid)
			this.drawGrid();

		for (var i = 0, n = this.visuals.length; i < n; ++i)
			this.drawVisual(this.visuals[i]);
	},
	drawBackground: function() {
	},
	drawGrid: function() {
	},
	drawHome: function() {
	},
	drawSpawn: function() {
	},
	drawVisual: function(element) {
	},
});

/*
 * The implementation for the canvas element
 */
var CanvasView = View.extend({
	init: function(element) {
		this._super(element.width, element.height);
		this.view = element;
		this.context = element.getContext('2d');
	},
	start: function() {
		var me = this;
		me.running = true;
		var render = function() {
			if (me.running)
				nextAnimationFrame(render);
			me.draw();
		};
		nextAnimationFrame(render);
	},
	drawVisual: function(element) {
		var ctx = this.context;
		var visual = element.visual;
		var sx = visual.index * visual.width;
		var sy = 0;
		var wo = this.width / this.mazeSize.width;
		var ho = this.height / this.mazeSize.height;
		var dx = element.mazeCoordinates.x * wo;
		var dy = element.mazeCoordinates.y * ho;
		var w = visual.scale * wo * Math.min(1, visual.width / visual.height);
		var h = visual.scale * ho * Math.min(1, visual.height / visual.width);
		dx += (wo - w) * 0.5;
		dy += (ho - h) * 0.5;
		ctx.drawImage(visual.image, sx, sy, visual.width, visual.height, dx, dy, w, h);
	},
	drawBackground: function() {
		var ctx = this.context;
		ctx.clearRect(0, 0, this.width, this.height);

		if (this.background)
			ctx.drawImage(this.background, 0, 0, this.width, this.height);
	},
	drawHome: function() {
		var ctx = this.context;
		var width = this.width / this.mazeSize.width;
		var height = this.height / this.mazeSize.height;
		var x = (this.mazeSize.width - 1) * width;
		var y = ~~(this.mazeSize.height * 0.5) * height;
		ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
		ctx.fillRect(x, y, width, height);
	},
	drawSpawn: function() {
		var ctx = this.context;
		var x = 0;
		var y = ~~(this.mazeSize.height * 0.5) * this.height / this.mazeSize.height;
		var width = this.width / this.mazeSize.width;
		var height = this.height / this.mazeSize.height;
		ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
		ctx.fillRect(x, y, width, height);
	},
	drawGrid: function() {
		var ctx = this.context;
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
		ctx.lineWidth = 0.8;

		for (var i = 1, w = this.mazeSize.width; i < w; ++i) {
			var x = i * this.width / w;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, this.height);
			ctx.stroke();
			ctx.closePath();
		}
		
		for (var j = 1, h = this.mazeSize.height; j < h; ++j) {
			var y = j * this.height / h;
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(this.width, y);
			ctx.stroke();
			ctx.closePath();
		}
	},
});