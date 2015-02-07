"use strict";
/*
 * The Standard unit
 */
var Mario = Unit.extend({
	init: function() {
		this._super(Mario.speed, 100, MazeStrategy.manhattan, Mario.hitpoints);
		this.createVisual(Mario.sprite, [8,8,8,8]);
	},
}, function(enemy) {
	enemy.speed = 2.0;
	enemy.hitpoints = 10;
	enemy.description = 'You have to be careful with that plumber.';
	enemy.nickName = 'Mario';
	enemy.sprite = 'mario';
	enemy.rating = enemy.speed * enemy.hitpoints;
	types.units['Mario'] = enemy;
});

/*
 * The Rope unit
 */
var Rope = Unit.extend({
	init: function() {
		this._super(Rope.speed, 80, MazeStrategy.euclideanNoSQR, Rope.hitpoints);
		this.createVisual(Rope.sprite, [4, 4, 4, 4], 0.8);
	},
}, function(rope) {
	rope.speed = 2.0;
	rope.hitpoints = 20;
	rope.description = 'An ugly rope that tries to conquer the zone. Watch out when they mass up!';
	rope.nickName = 'Rope';
	rope.sprite = 'rope';
	rope.rating = rope.speed * rope.hitpoints;
	types.units['Rope'] = rope;
});

/*
 * The Fire Wizard Robe unit
 */
var FireWizzrobe = Unit.extend({
	init: function() {
		this._super(FireWizzrobe.speed, 70, MazeStrategy.manhattan, FireWizzrobe.hitpoints);
		this.createVisual(FireWizzrobe.sprite, [3, 3, 3, 3], 1.4);
	},
}, function(wizz) {
	wizz.speed = 3.0;
	wizz.hitpoints = 30;
	wizz.description = 'The wizard with the fire robe is quite fast, but does not take very much.';
	wizz.nickName = 'Wizzrobe';
	wizz.sprite = 'firewizzrobe';
	wizz.rating = wizz.speed * wizz.hitpoints;
	types.units['FireWizzrobe'] = wizz;
});

/*
 * The Air Wolf unit
 */
var AirWolf = Unit.extend({
	init: function() {
		this._super(AirWolf.speed, 50, MazeStrategy.air, AirWolf.hitpoints);
		this.createVisual(AirWolf.sprite, [4]);
	},
}, function(wolf) {
	wolf.speed = 2.0;
	wolf.hitpoints = 40;
	wolf.description = 'The air wolf is the only aerial unit in the game. Do not underestimate him as an air wolf fleet could kill you.';
	wolf.nickName = 'Wolf';
	wolf.sprite = 'airwolf';
	wolf.rating = wolf.speed * wolf.hitpoints * 1.2;
	types.units['AirWolf'] = wolf;
});

/*
 * The dark nut unit
 */
var DarkNut = Unit.extend({
	init: function() {
		this._super(DarkNut.speed, 80, MazeStrategy.euclideanNoSQR, DarkNut.hitpoints);
		this.createVisual(DarkNut.sprite, [4, 4, 4, 4]);
	},
}, function(nut) {
	nut.speed = 2.5;
	nut.hitpoints = 150;
	nut.description = 'The dark nut is an ancient warrier that takes quite some hits. His speed is superior to most other units.';
	nut.nickName = 'Dark Nut';
	nut.sprite = 'darknut';
	nut.rating = nut.speed * nut.hitpoints;
	types.units['DarkNut'] = nut;
});

/*
 * A derived unit
 */
var Speedy = Unit.extend({
	init: function() {
		this._super(Speedy.speed, 25, MazeStrategy.diagonalShortCut, Speedy.hitpoints);
		this.createVisual(Speedy.sprite, [20]);
	},
}, function(unit) {
	unit.speed = 7.0;
	unit.hitpoints = 200;
	unit.description = 'This unit is just a single blob. It is ultra fast and has quite some armor. It will give you some trouble.';
	unit.nickName = 'HAL';
	unit.sprite = 'newunit';
	unit.rating = unit.speed * unit.hitpoints;
	types.units['Speedy'] = unit;
});

/*
 * The big Armored unit
 */
var Armos = Unit.extend({
	init: function() {
		this._super(Armos.speed, 125, MazeStrategy.euclidean, Armos.hitpoints);
		this.createVisual(Armos.sprite, [4, 4, 4, 4], 1.2);
	},
}, function(armos) {
	armos.speed = 1.0;
	armos.hitpoints = 600;
	armos.description = 'The unit is actually called Armos and not Armor, however, Armor would have been a good name as well. You will need some fire power to bring him down.';
	armos.nickName = 'Armos';
	armos.sprite = 'armos';
	armos.rating = armos.speed * armos.hitpoints;
	types.units['Armos'] = armos;
});