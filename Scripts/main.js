"use strict";
/*
 * The available images
 * @override Add owner and target for GameObject and filter for Tower 
 */
var images = {};

/*
 * The available sounds
 */
var sounds = {};

/*
 * The path
 */
var Path = Class.extend({
	init: function(list) {
		this.list = list;
	},
	propagate: function(pathLength) {
		var lastIndex = ~~pathLength;
		var dir = Direction.bottom;

		if (lastIndex + 1 >= this.list.length)
			return false;

		if (this.list[lastIndex].x < this.list[lastIndex + 1].x)
			dir = Direction.right;
		else if (this.list[lastIndex].x > this.list[lastIndex + 1].x)
			dir = Direction.left;
		else if (this.list[lastIndex].y > this.list[lastIndex + 1].y)
			dir = Direction.top;

		var point = this.list[lastIndex + 1].subtract(this.list[lastIndex]);
		point = point.scale(pathLength - lastIndex);
		point = this.list[lastIndex].add(point);

		return {
			point: point,
			direction: dir,
		};
	},
});

/*
 * The base for classes with events 
 */
var Base = Class.extend({
	init: function() {
		this.events = {};
	},
	registerEvent: function(event) {
		if (!this.events[event])
			this.events[event] = [];
	},
	unregisterEvent: function(event) {
		if (this.events[event])
			delete this.events[event];
	},
	triggerEvent: function(event, args) {
		if (this.events[event]) {
			var e = this.events[event];

			for (var i = e.length; i--; )
				e[i].apply(this, [args || {}]);
		}
	},
	addEventListener: function(event, handler) {
		if (this.events[event] && handler && typeof(handler) === 'function')
			this.events[event].push(handler);
	},
	removeEventListener: function(event, handler) {
		if (this.events[event]) {
			if (handler && typeof(handler) === 'function') {
				var index = this.events[event].indexOf(handler);
				this.events[event].splice(index, 1);
			} else
				this.events[event].splice(0, this.events[event].length);
		}
	},
});

/*
 * The player class
 */
var Player = Base.extend({ 
	init: function(name) {
		this._super();
		this.name = name || 'Player';
		this.money = 0;
		this.points = 0;
		this.hitpoints = 0;
		this.side = 0;
		this.maxTowerNumber = 0;
		this.shootingTowerNumber = 0;
		this.registerEvent(events.towerNumberChanged);
		this.registerEvent(events.playerDefeated);
		this.registerEvent(events.moneyChanged);
		this.registerEvent(events.healthChanged);
		this.registerEvent(events.pointChanged);
	},
	setMoney: function(value) {
		this.money = value;
		this.triggerEvent(events.moneyChanged, this);

		this.updatePoints();
	},
	addMoney: function(value) {
		this.setMoney(this.money + value);
	},
	getMoney: function() {
		return this.money;
	},
	setHitpoints: function(value) {
		this.hitpoints = Math.max(0, value);
		this.triggerEvent(events.healthChanged, this);

		this.updatePoints();

		if (this.hitpoints === 0)
			this.triggerEvent(events.playerDefeated, this);
	},
	addHitpoints: function(value) {
		this.setHitpoints(this.hitpoints + value);
	},
	getHitpoints: function() {
		return this.hitpoints;
	},
	hit: function(unit) {
		this.setHitpoints(this.hitpoints - unit.damage);
	},
	updatePoints: function() {
		this.points = this.hitpoints + ~~(this.money / 10);
		this.triggerEvent(events.pointChanged, this);
	}
});

/*
 * The base for game objects (units, towers, shots)
 */
var GameObject = Base.extend({
	init: function(owner, target, speed, animationDelay) {
		this._super();
		this.z = 0;
		this.mazeCoordinates = new Point();
		this.speed = speed || 0;
		this.animationDelay = animationDelay || 15;
		this.dead = false;
		this.direction = Direction.right;

		// Modification
		this.owner = owner || {};
		this.target = target || {};

	},
	distanceTo: function(point) {
		return point.subtract(this.mazeCoordinates).norm();
	},
	update: function() {
		var visual = this.visual;
		var direction = visual.frames.length === 4 ? this.direction : 0;
		visual.time += constants.ticks; 

		if (visual.direction !== this.direction) {
			visual.direction = this.direction;
			visual.time = 0;
			visual.index = 0;

			for (var i = 0; i < direction; ++i)
				visual.index += visual.frames[i];
		} else if (visual.delay < visual.time) {
			var frames = 0;
			var index = 0;
			visual.index++;
			visual.time = 0;

			for (var i = 0; i < direction; ++i)
				index += visual.frames[i];

			if (visual.index === index + visual.frames[direction])
				visual.index = index;
		}
	},
	getClosestTarget: function(targets, maximum) {
		var closestTarget;
		var dist = Number.MAX_VALUE;

		for (var i = targets.length; i--; ) {
			var target = targets[i];
			var t = this.distanceTo(target.mazeCoordinates);

			if (t < dist) {
				closestTarget = target;
				dist = t;
			}
		}

		if (dist <= maximum)
			return closestTarget;
	},
	getOwner: function() {
		return this.owner;
	},
	playSound: function(soundName) {
		var audio = sounds[soundName];
		var sound = new Sound(audio);
		sound.play();
	},
	createVisual: function(imageName, frames, scale) {
		var total = 0;
		var index = 0;
		var image = images[imageName];

		for (var i = frames.length; i--; ) {
			total += frames[i];

			if (i < this.direction)	
				index += frames[i];
		}

		if (frames.length === 1)
			index = 0;

		this.visual = {
			direction : this.direction,
			index : index,
			time : 0,
			length : total,
			frames : frames,
			image : image,
			delay : this.animationDelay,
			width : image.width / total,
			height: image.height,
			scale : scale || 1,
		};
	},
});

/*
 * The tower base
 */
var Tower = GameObject.extend({
	init: function(owner, target, speed, animationDelay, range, shotType) {
		this._super(owner, target, speed, animationDelay);
		this.range = range || 0;
		this.targets = [];
		this.timeToNextShot = 0;
		this.mazeWeight = 0;
		this.side = 0;
		this.direction = Direction.left;
		this.shotType = shotType || {};
		this.registerEvent(events.shot);
	},
	targetFilter: function(target) {
		return target.strategy !== MazeStrategy.air && target.owner !== this.owner;
	},
	update: function() {
		this._super();
		var shot = undefined;

		if (this.timeToNextShot <= 0)
			shot = this.shoot();
		
		if (shot) {
			this.triggerEvent(events.shot, shot);
			this.timeToNextShot = ~~(1000 / this.speed);
		} else
			this.timeToNextShot -= constants.ticks;
	},
	shoot: function() {
		var me = this;
		var targets = this.targets.filter((this.targetFilter), me);
		var closestTarget = this.getClosestTarget(targets, this.range);

		if (!(this instanceof Rock)) { // Modification here to stop Rock from shooting
			if (closestTarget) {
				var shot = new (this.shotType)(this.owner, this.target);
							shot.origin = this;
	            shot.mazeCoordinates = this.mazeCoordinates;
	            shot.velocity = closestTarget.mazeCoordinates.subtract(this.mazeCoordinates);
	            shot.direction = shot.velocity.toDirection();
	            shot.targets = targets;
	            this.direction = shot.direction;
	            return shot;
			}
		}
	},
});

/*
 * The unit base
 */
var Unit = GameObject.extend({
 	init: function(owner, target, speed, animationDelay, mazeStrategy, hitpoints, prize) {
		this._super(owner, target, speed, animationDelay);
 		this.timer = 0;
 		this.path = new Path([]);
 		this.mazeCoordinates = new Point();
 		this.damage = 1;
 		this.strategy = mazeStrategy;
 		this.hitpoints = hitpoints || 0;
 		this.health = this.hitpoints;
 		this.direction = Direction.right;
 		this.prize = prize || 0; // Put prize money
 		this.registerEvent(events.accomplished);
 		this.registerEvent(events.died);
 	},
 	playInitSound: function() {
		this.playSound('humm');
 	},
 	playDeathSound: function() {
 		this.playSound('explosion');
 	},
 	playVictorySound: function() {
		this.playSound('laugh');
 	},
 	update: function() {
 		this._super();
 		this.timer += constants.ticks;
 		var s = this.speed * 0.001;

 		if (!this.dead && s > 0) {
 			var sigma = this.path.propagate(s * this.timer);

 			if (!sigma) {
 				this.dead = true;
 				this.triggerEvent(events.accomplished, this);
 				this.playVictorySound();
 			} else {
 				this.mazeCoordinates = sigma.point;
 				this.direction = sigma.direction;
 			}
 		}
 	},
 	hit: function(shot) {
 		this.health -= shot.damage;

 		if (!this.dead && this.health <= 0) {
 			this.health = 0;
 			this.dead = true;
 			this.triggerEvent(events.died, this);
 			this.target.addMoney(this.prize); // Add money for opponent if shot dead
 			this.playDeathSound();
 		}
 	},
 });

/*
 * The shot base
 */
var Shot = GameObject.extend({
	init: function(owner, target, speed, animationDelay, damage, impactRadius) {
		this._super(owner, target, speed, animationDelay);
		this.damage = damage || 0;
		this.targets = [];
		this.impactRadius = impactRadius || 0.5;
		this.timeToDamagability = ~~(200 / this.speed);
		this.velocity = new Point();
		this.registerEvent(events.hit);
		this.origin = undefined;
	},
	update: function() {
		var pt = this.velocity.scale(this.speed * constants.ticks * 0.001);
		this.mazeCoordinates = this.mazeCoordinates.add(pt);
		this._super();

		if (this.distanceTo(this.origin.mazeCoordinates) > this.origin.range) {
			this.dead = true;
			return;
		}

		if (this.timeToDamagability > 0) {
			this.timeToDamagability -= constants.ticks;
		} else {
			var closestTarget = this.getClosestTarget(this.targets, this.impactRadius);
			
			if (closestTarget) {
				closestTarget.hit(this);
				this.dead = true;
				this.triggerEvent(events.hit, closestTarget);
			}
		}
	},
});