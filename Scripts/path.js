"use strict";
/*
 * PathFinderNodeType ENUM
 */
var PathFinderNodeType = {
	start   : 1,
	end     : 2,
	open    : 4,
	close   : 8,
	current : 16,
	path    : 32
};

/*
 * MazeStrategy ENUM
 */
var MazeStrategy = {
	manhattan        : 1,
	maxDXDY          : 2,
	diagonalShortCut : 3,
	euclidean        : 4,
	euclideanNoSQR   : 5,
	custom           : 6,
	air              : 7
};

/*
 * Direction ENUM
 */
var Direction = {
	right : 0,
	top : 1,
	left : 2,
	bottom : 3,
};

var Steps = {
	WithDiagonals : [[0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1]],
	OnlyStraight : [[0, -1], [1, 0], [0, 1], [-1, 0]],
};

/*
 * Point STRUCT
 */
var Point = Class.extend({
	init: function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	},
	clone: function() {
		return new Point(this.x, this.y);
	},
	add: function(pt) {
		return new Point(this.x + pt.x, this.y + pt.y);
	},
	subtract: function(pt) {
		return new Point(this.x - pt.x, this.y - pt.y);
	},
	projectOn: function(pt) {
		return this.x * pt.x + this.y * pt.y;
	},
	norm: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},
	square: function() {
		return this.x * this.x + this.y * this.y;
	},
	scale: function(factor) {
		return new Point(this.x * factor, this.y * factor);
	},
	normalize: function() {
		var norm = 1.0 / this.norm();
		return this.scale(norm);
	},
	regularize: function() {
		if (this.x === 0 && this.y === 0)
			return new Point(2 * Math.round(Math.random()) - 1, 2 * Math.round(Math.random()) - 1);

		return this;
	},
	toDirection: function() {
		if (this.x > this.y)
			return this.x > -this.y ? Direction.right : Direction.top;
		else if (this.x > -this.y)
			return Direction.bottom;
		return Direction.left;
	},
});

/*
 * Size STRUCT
 */
var Size = Class.extend({
	init: function(width, height) {
		this.width = width || 0;
		this.height = height || 0;
	},
	clone: function() {
		return new Size(this.width, this.height);
	},
	divide: function(sz) {
		return new Size(this.width / sz.width, this.height / sz.height);
	}
});

/*
 * PathFinderNode STRUCT
 */
var PathFinderNode = Class.extend({
	init: function() {
		this.f = 0;
		this.g = 0;
		this.h = 0;
		this.x = 0;
		this.y = 0;
		this.px = 0;
		this.py = 0;
	},
	clone: function() {
		var c = new PathFinderNode();
		c.f = this.f;
		c.g = this.g;
		c.h = this.h;
		c.x = this.x;
		c.y = this.y;
		c.px = this.px;
		c.py = this.py;
		return c;
	}
});

/*
 * PriorityQueue CLASS
 */
var PriorityQueue = Class.extend({
	init: function(comparer, type) {
		this.type = type;
		this.innerList = [];
		this.comparer = comparer;
	},
	switchElements: function(i, j) {
		var h = this.innerList[i];
		this.innerList[i] = this.innerList[j];
		this.innerList[j] = h;
	},
	onCompare: function(i, j) {
		return this.comparer(this.innerList[i], this.innerList[j]);
	},
	push: function(item) {
		var p = this.innerList.length, p2;
		this.innerList.push(item);

		do {
			if (p === 0)
				break;

			p2 = ~~((p - 1) * 0.5);

			if (this.onCompare(p, p2) < 0) {
				this.switchElements(p, p2);
				p = p2;
			} else
				break;
		} while(true);

		return p;
	},
	pop: function() {
		var result = this.innerList[0];
		var p = 0, p1, p2, pn;
		this.innerList[0] = this.innerList[this.innerList.length - 1];
		this.innerList.splice(this.innerList.length - 1, 1);

		do {
			pn = p;
			p1 = 2 * p + 1;
			p2 = 2 * p + 2;

			if (this.innerList.length > p1 && this.onCompare(p, p1) > 0)
				p = p1;

			if (this.innerList.length > p2 && this.onCompare(p, p2) > 0)
				p = p2;
			
			if (p === pn)
				break;

			this.switchElements(p, pn);
		} while(true);

		return result;
	},
	update: function(i) {
		var p = i,pn;
		var p1, p2;

		do {
			if (p === 0)
				break;

			p2 = ~~((p - 1) * 0.5);

			if (this.onCompare(p, p2) < 0) {
				this.switchElements(p, p2);
				p = p2;
			} else
				break;
		} while (true);

		if (p < i)
			return;

		do {
			pn = p;
			p1 = 2 * p + 1;
			p2 = 2 * p + 2;

			if (this.innerList.length > p1 && this.onCompare(p, p1) > 0)
				p = p1;

			if (this.innerList.length > p2 && this.oCompare(p, p2) > 0)
				p = p2;
			
			if (p === pn)
				break;

			this.switchElements(p, pn);
		} while (true);
	},
	peek: function() {
		if (this.innerList.length)
			return this.innerList[0];

		return new this.type();
	},
	clear: function() {
		this.innerList = [];
	},
	count: function() {
		return this.innerList.length;
	},
	removeLocation: function(item) {
		var index = -1;

		for (var i = 0; i < this.innerList.length; i++) {
			if (this.comparer.compare(this.innerList[i], item) === 0)
				index = i;
		}

		if (index !== -1)
			this.innerList.splice(index, 1);
	},
	get: function(index) {
		return this.innerList[index];
	},
	set: function(index, value) { 
		this.innerList[index] = value;
		this.update(index);
	}
});

/*
 * Maze CLASS
 */
var Maze = Class.extend({
	init: function(size, start, end) {
		this.gridDim = size;
		var grid = [];

		for (var i = 0; i < size.width + 1; i++) {
			var a = [];

			for (var j = 0; j < size.height; j++)
				a.push(1);

			grid.push(a);
		}

		this.grid = grid;
		this.start = start || new Point(0, ~~(size.height * 0.5));
		this.end = end || new Point(size.width, ~~(size.height * 0.5));
		this.pf = new PathFinder(this.grid);
		this.pf.diagonals = false;
		this.paths = {};
	},
	isPointInGrid: function(point) {
		if (point.x > this.gridDim.width - 1 || point.x < 0)
			return false;

		if (point.y > this.gridDim.height - 1 || point.y < 0)
			return false;

		return true;
	},
	tryBuild: function(point, weight) {
		if (this.grid[point.x][point.y] !== 1)
			return false;
		else if (point.x === this.gridDim.width - 1 || point.x === 0)
			return false;

		this.grid[point.x][point.y] = weight || 0;
		this.pf.formula = MazeStrategy.euclidean;

		if (this.pf.findPath(this.start, this.end)) {
			this.paths = {};
			return true;
		} else {
			this.grid[point.x][point.y] = 1;
			return false;
		}
	},
	tryRemove: function(point) {
		if (this.grid[point.x][point.y] !== 1) {
			this.grid[point.x][point.y] = 1;
			this.paths = {};
			return true;
		}
		
		return false;
	},
	getPath: function(mazeStrategy) {
		if (mazeStrategy === MazeStrategy.air)
			return this.getPathAir();

		if (!this.paths[mazeStrategy])
			this.calculate(mazeStrategy);
		
		return this.paths[mazeStrategy];
	},
	getPathAir: function() {
		var path = [];

		for (var i = this.start.x; i < this.end.x + 1; ++i)
			path.push(new Point(i, this.start.y));

		return path;
	},
	calculate: function(mazeStrategy) {
		if (mazeStrategy === MazeStrategy.air) {
			var path = this.getPathAir();
		} else {
			var path = [];
			this.pf.formula = mazeStrategy;
			var nodes = this.pf.findPath(this.start, this.end);

			for (var i = 0; i < nodes.length; i++)
				path.push(new Point(nodes[i].x, nodes[i].y));
		}

		this.paths[mazeStrategy] = path;
	}
});

/*
 * PathFinder CLASS
 */
var PathFinder = Class.extend({
	init: function(grid) {
		this.grid = grid;
		this.formula = MazeStrategy.manhattan;
		this.horiz = 0;
		this.stopped = true;
		this.diagonals = true;
		this.stop = false;
		this.heuristicEstimate = 2;
		this.punishChangeDirection = false;
		this.reopenCloseNodes = false;
		this.tieBreaker = false;
		this.heavyDiagonals = false;
		this.searchLimit = 2000;
		this.reset();
	},
	reset: function() {
		this.close = [];
		this.open = new PriorityQueue(function(x, y) {
			if (x.f > y.f) return 1;
			else if (x.f < y.f) return -1;
			return 0;
		}, PathFinderNode);
	},
	findPath: function(start, end) {
		var me = this;
		var parentNode = new PathFinderNode();
		var found = false;
		var gridX = me.grid.length;
		var gridY = me.grid[0].length;
		me.stop = false;
		me.stopped = false;
		me.reset();
		var direction = me.diagonals ? Steps.WithDiagonals : Steps.OnlyStraight;
		var ndiag = me.diagonals ? 8 : 4;

		parentNode.g = 0;
		parentNode.h = me.heuristicEstimate;
		parentNode.f = parentNode.g + parentNode.h;
		parentNode.x = start.x;
		parentNode.y = start.y;
		parentNode.px = parentNode.x;
		parentNode.py = parentNode.y;

		me.open.push(parentNode);

		while (me.open.count() > 0 && !me.stop) {
			parentNode = me.open.pop();

			if (parentNode.x === end.x && parentNode.y === end.y) {
				me.close.push(parentNode);
				found = true;
				break;
			}

			if (me.close.length > me.searchLimit) {
				me.stopped = true;
				return;
			}

			if (me.punishChangeDirection)
				me.horiz = (parentNode.x - parentNode.px); 

			for (var i = 0; i < ndiag; i++) {
				var newNode = new PathFinderNode();
				newNode.x = parentNode.x + direction[i][0];
				newNode.y = parentNode.y + direction[i][1];

				if (newNode.x < 0 || newNode.y < 0 || newNode.x >= gridX || newNode.y >= gridY)
					continue;

				var newG = parentNode.g;

				if (me.heavyDiagonals && i > 3)
					newG += ~~(me.grid[newNode.x][newNode.y] * 2.41);
				else
					newG += this.grid[newNode.x][newNode.y];

				if (newG === parentNode.g)
					continue;

				if (me.punishChangeDirection) {
					if (newNode.x - parentNode.x && !me.horiz)
						newG += 20;

					if (newNode.y - parentNode.y && me.horiz)
						newG += 20;
				}

				var foundInOpenIndex = -1;

				for(var j = 0, n = me.open.count(); j < n; j++) {
					if (me.open.get(j).x === newNode.x && me.open.get(j).y === newNode.y) {
						foundInOpenIndex = j;
						break;
					}
				}

				if (foundInOpenIndex !== -1 && me.open.get(foundInOpenIndex).g <= newG)
					continue;

				var foundInCloseIndex = -1;

				for (var j = 0, n = me.close.length; j < n; j++) {
					if (me.close[j].x === newNode.x && me.close[j].y === newNode.y) {
						foundInCloseIndex = j;
						break;
					}
				}

				if (foundInCloseIndex !== -1 && (me.reopenCloseNodes || me.close[foundInCloseIndex].g <= newG))
					continue;

				newNode.px = parentNode.x;
				newNode.py = parentNode.y;
				newNode.g = newG;

				switch (me.formula) {
					case MazeStrategy.maxDXDY:
						newNode.h = me.heuristicEstimate * (Math.max(Math.abs(newNode.x - end.x), Math.abs(newNode.y - end.y)));
						break;

					case MazeStrategy.diagonalShortCut:
						var h_diagonal = Math.min(Math.abs(newNode.x - end.x), Math.abs(newNode.y - end.y));
						var h_straight = (Math.abs(newNode.x - end.x) + Math.abs(newNode.y - end.y));
						newNode.h = (me.heuristicEstimate * 2) * h_diagonal + me.heuristicEstimate * (h_straight - 2 * h_diagonal);
						break;

					case MazeStrategy.euclidean:
						newNode.h = ~~(me.heuristicEstimate * Math.sqrt(Math.pow((newNode.x - end.x) , 2) + Math.pow((newNode.y - end.y), 2)));
						break;

					case MazeStrategy.euclideanNoSQR:
						newNode.h = ~~(me.heuristicEstimate * (Math.pow((newNode.x - end.x) , 2) + Math.pow((newNode.y - end.y), 2)));
						break;

					case MazeStrategy.custom:
						var dxy = new Point(Math.abs(end.x - newNode.x), Math.abs(end.y - newNode.y));
						var orthogonal = Math.abs(dxy.x - dxy.y);
						var diagonal = Math.abs(((dxy.x + dxy.y) - orthogonal) * 0.5);
						newNode.h = me.heuristicEstimate * (diagonal + orthogonal + dxy.x + dxy.y);
						break;
						
					case MazeStrategy.manhattan:
					default:
						newNode.h = me.heuristicEstimate * (Math.abs(newNode.x - end.x) + Math.abs(newNode.y - end.y));
						break;
				}

				if (me.tieBreaker) {
					var dx1 = parentNode.x - end.x;
					var dy1 = parentNode.y - end.y;
					var dx2 = start.x - end.x;
					var dy2 = start.y - end.y;
					var cross = Math.abs(dx1 * dy2 - dx2 * dy1);
					newNode.h = ~~(newNode.h + cross * 0.001);
				}

				newNode.f = newNode.g + newNode.h;
				me.open.push(newNode);
			}

			me.close.push(parentNode);
		}

		if (found) {
			var fNode = me.close[me.close.length - 1].clone();

			for (var i = me.close.length - 1; i >= 0; i--) {
				if ((fNode.px === me.close[i].x && fNode.py === me.close[i].y) || i === me.close.Count - 1)
					fNode = me.close[i].clone();
				else
					me.close.splice(i, 1);
			}

			me.stopped = true;
			return me.close;
		}

		me.stopped = true;
	}
});