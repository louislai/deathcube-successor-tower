"use strict";
/*
 * The Standard unit
 * @override Add own and target for units
 */
var Mario = Unit.extend({
	init: function(owner, target) {
		this._super(owner, target, Mario.speed, 100, MazeStrategy.manhattan, Mario.hitpoints, 1);
		this.createVisual(Mario.sprite, [8,8,8,8]);
	},
}, function(enemy) {
	enemy.speed = 2.0;
	enemy.hitpoints = 10;
	enemy.description = 'You have to be careful with that plumber.';
	enemy.nickName = 'Mario';
	enemy.sprite = 'mario';
	enemy.rating = enemy.speed * enemy.hitpoints;
	enemy.cost = Math.round(enemy.rating / 20.0 + 1.0);
	types.units['Mario'] = enemy;
});

/*
 * The Rope unit
 */
var Rope = Unit.extend({
	init: function(owner, target) {
		this._super(owner, target, Rope.speed, 80, MazeStrategy.euclideanNoSQR, Rope.hitpoints, 2);
		this.createVisual(Rope.sprite, [4, 4, 4, 4], 0.8);
	},
}, function(rope) {
	rope.speed = 2.0;
	rope.hitpoints = 20;
	rope.description = 'An ugly rope that tries to conquer the zone. Watch out when they mass up!';
	rope.nickName = 'Rope';
	rope.sprite = 'rope';
	rope.rating = rope.speed * rope.hitpoints;	
	rope.cost = Math.round(rope.rating / 20.0 + 1.0);
	types.units['Rope'] = rope;
});

/*
 * The Fire Wizard Robe unit
 */
var FireWizzrobe = Unit.extend({
	init: function(owner, target) {
		this._super(owner, target, FireWizzrobe.speed, 70, MazeStrategy.manhattan, FireWizzrobe.hitpoints, 3);
		this.createVisual(FireWizzrobe.sprite, [3, 3, 3, 3], 1.4);
	},
}, function(wizz) {
	wizz.speed = 3.0;
	wizz.hitpoints = 30;
	wizz.description = 'The wizard with the fire robe is quite fast, but does not take very much.';
	wizz.nickName = 'Wizzrobe';
	wizz.sprite = 'firewizzrobe';
	wizz.rating = wizz.speed * wizz.hitpoints;
	wizz.cost = Math.round(wizz.rating / 20.0 + 1.0);
	types.units['FireWizzrobe'] = wizz;
});

/*
 * The dark nut unit
 */
var DarkNut = Unit.extend({
	init: function(owner, target) {
		this._super(owner, target, DarkNut.speed, 80, MazeStrategy.euclideanNoSQR, DarkNut.hitpoints, 10);
		this.createVisual(DarkNut.sprite, [4, 4, 4, 4]);
	},
}, function(nut) {
	nut.speed = 2.5;
	nut.hitpoints = 150;
	nut.description = 'The dark nut is an ancient warrier that takes quite some hits. His speed is superior to most other units.';
	nut.nickName = 'Dark Nut';
	nut.sprite = 'darknut';
	nut.rating = nut.speed * nut.hitpoints;
	nut.cost = Math.round(nut.rating / 20.0 + 1.0);
	types.units['DarkNut'] = nut;
});

/*
 * A derived unit
 */
var Speedy = Unit.extend({
	init: function(owner, target) {
		this._super(owner, target, Speedy.speed, 25, MazeStrategy.diagonalShortCut, Speedy.hitpoints, 28);
		this.createVisual(Speedy.sprite, [20]);
	},
}, function(unit) {
	unit.speed = 7.0;
	unit.hitpoints = 200;
	unit.description = 'This unit is just a single blob. It is ultra fast and has quite some armor. It will give you some trouble.';
	unit.nickName = 'HAL';
	unit.sprite = 'newunit';
	unit.rating = unit.speed * unit.hitpoints;
	unit.cost = Math.round(unit.rating / 20.0 + 1.0) - 15;
	types.units['Speedy'] = unit;
});

/*
 * The big Armored unit
 */
var Armos = Unit.extend({
	init: function(owner, target) {
		this._super(owner, target, Armos.speed, 125, MazeStrategy.euclidean, Armos.hitpoints, 20);
		this.createVisual(Armos.sprite, [4, 4, 4, 4], 1.2);
	},
}, function(armos) {
	armos.speed = 1.0;
	armos.hitpoints = 600;
	armos.description = 'The unit is actually called Armos and not Armor, however, Armor would have been a good name as well. You will need some fire power to bring him down.';
	armos.nickName = 'Armos';
	armos.sprite = 'armos';
	armos.rating = armos.speed * armos.hitpoints;
	armos.cost = Math.round(armos.rating / 20.0 + 1.0) + 10;
	types.units['Armos'] = armos;
});