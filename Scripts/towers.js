"use strict";

/*
 * A stupid rock
 */
var Rock = Tower.extend({
	init: function() {
		this._super(Rock.speed, 200, Rock.range);
		this.createVisual(Rock.sprite, [1]);
	},
}, function(rock) {
	rock.description = "Just a rock ... a big ROCK. If you can't boulder you have to go around.";
	rock.nickName = 'Rock';
	rock.sprite = 'rock';
	rock.frames = 1;
	rock.shotType = {};
	rock.speed = 0;
	rock.range = 0;
	rock.rating = 0;
	rock.cost = 1.0;
	types.towers['Rock'] = rock;
});

/*
 * The efficient MG nest
 */
var MGNest = Tower.extend({
	init: function() {
		this._super(MGNest.speed, 25, MGNest.range, MGNest.shotType);
		this.createVisual(MGNest.sprite, [1]);
	},
}, function(nest) {
	nest.description = 'The MG Nest is cheap but powerful. It can help you a lot against low armored units.';
	nest.nickName = 'MG Nest';
	nest.sprite = 'mgnest';
	nest.frames = 1;
	nest.shotType = MGShot;
	nest.speed = 4.0;
	nest.range = 4.0;
	nest.rating = nest.speed * Math.log(nest.range + 1.0) * nest.shotType.rating;
	nest.cost = Math.round(nest.rating / 6.0 + 1.0);
	types.towers['MGNest'] = nest;
});

/*
 * The canon tower
 */
var CanonTower = Tower.extend({
	init: function() {
		this._super(CanonTower.speed, 50, CanonTower.range, CanonTower.shotType);
		this.createVisual(CanonTower.sprite, [1, 1, 1, 1]);
	},
}, function(canon) {
	canon.description = 'The backbone in war! It has an amazing range and shoots shells, however, the firing speed could be better.';
	canon.nickName = 'Canon';
	canon.sprite = 'canontower';
	canon.frames = 4;
	canon.shotType = ShellShot;
	canon.speed = 1.0;
	canon.range = 8.0;
	canon.rating = canon.speed * Math.log(canon.range + 1.0) * canon.shotType.rating;
	canon.cost = Math.round(canon.rating / 6.0 + 1.0);
	types.towers['CanonTower'] = canon;
});

/*
 * The flame tower
 */
var FlameTower = Tower.extend({
	init: function() {
		this._super(FlameTower.speed, 200, FlameTower.range, FlameTower.shotType);
		this.createVisual(FlameTower.sprite, [4]);
	},
}, function(flame) {
	flame.description = 'Burn them down but a bit faster ... Excellent for slow armored units, but fails against strong armored enemies.';
	flame.nickName = 'Flame tower';
	flame.sprite = 'flametower';
	flame.frames = 4;
	flame.shotType = FlameShot;
	flame.speed = 6.0;
	flame.range = 2.0;
	flame.rating = flame.speed * Math.log(flame.range + 1.0) * flame.shotType.rating;
	flame.cost = Math.round(flame.rating / 6.0 + 1.0);
	types.towers['FlameTower'] = flame;
});

/*
 * The anti-air Flak tower
 */
var Flak = Tower.extend({
	init: function() {
		this._super(Flak.speed, 200, Flak.range, Flak.shotType);
		this.createVisual(Flak.sprite, [1, 1, 1, 1]);
	},
	targetFilter: function(target) {
			return target.strategy === MazeStrategy.air;
	},
}, function(flak) {
	flak.description = 'SAM! The only anti-air tower you will ever want (and you will ever get in this game).';
	flak.nickName = 'SAM';
	flak.sprite = 'flak';
	flak.frames = 4;
	flak.shotType = AirShot;
	flak.speed = 5.0;
	flak.range = 5.0;
	flak.rating = flak.speed * Math.log(flak.range + 1.0) * flak.shotType.rating;
	flak.cost = Math.round(flak.rating / 24.0 + 1.25);
	types.towers['Flak'] = flak;
});

/*
 * The ice tower
 */
var IceTower = Tower.extend({
	init: function() {
		this._super(IceTower.speed, 200, IceTower.range, IceTower.shotType);
		this.createVisual(IceTower.sprite, [1, 1, 1, 1]);
	},
}, function(ice) {
	ice.description = 'Cool. Slow shots, but with high efficiency. The right choice against slow strongly armored units.';
	ice.nickName = 'Ice-Tower';
	ice.sprite = 'icetower';
	ice.frames = 4;
	ice.shotType = IceShot;
	ice.speed = 2.0;
	ice.range = 6.0;
	ice.rating = ice.speed * Math.log(ice.range + 1.0) * ice.shotType.rating;
	ice.cost = Math.round(ice.rating / 6.0 + 1.0);
	types.towers['IceTower'] = ice;
});

/*
 * The laser tower
 */
var LaserTower = Tower.extend({
	init: function() {
		this._super(LaserTower.speed, 25, LaserTower.range, LaserTower.shotType);
		this.createVisual(LaserTower.sprite, [1, 1, 1, 1]);
	},
}, function(laser) {
	laser.description = "Won't play with you, but does it with high efficiency. Really fast low damage shots.";
	laser.nickName = 'Faser';
	laser.sprite = 'lasertower';
	laser.frames = 4;
	laser.shotType = LaserShot;
	laser.speed = 3.0;
	laser.range = 5.0;
	laser.rating = laser.speed * Math.log(laser.range + 1.0) * laser.shotType.rating;
	laser.cost = Math.round(laser.rating / 6.0 + 1.0);
	types.towers['LaserTower'] = laser;
});

/*
 * The famous gate to hell
 */
var GateToHell = Tower.extend({
	init: function() {
		this._super(GateToHell.speed, 200, GateToHell.range, GateToHell.shotType);
		this.createVisual(GateToHell.sprite, [6]);
	},
}, function(gate) {
	gate.description = 'Paint rules! This is the ultimate weapon of war, but it will not kill high speed units.';
	gate.nickName = 'Hellgate';
	gate.sprite = 'gatetohell';
	gate.frames = 6;
	gate.shotType = HellShot;
	gate.speed = 1.0;
	gate.range = 2.0;
	gate.rating = gate.speed * Math.log(gate.range + 1.0) * gate.shotType.rating;
	gate.cost = Math.round(gate.rating / 6.0 + 1.0);
	types.towers['GateToHell'] = gate;
});