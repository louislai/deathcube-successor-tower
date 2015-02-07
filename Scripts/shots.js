"use strict";
/*
 * The standard shot
 */
var StandardShot = Shot.extend({
	init: function() {
		this._super(StandardShot.speed, 15, StandardShot.damage, StandardShot.impactRadius);
		this.createVisual(StandardShot.sprite, [1], 0.25);
		this.playSound('wowpulse');
	},
}, function(std) {
	std.nickName = 'Standard';
	std.description = 'Just an ordinary shot with no special ability.';
	std.sprite = 'sunshot';
	std.frames = 1;
	std.speed = 10;
	std.damage = 1;
	std.impactRadius = 0.5;
	std.rating = Math.log(std.speed + 1) * std.damage * Math.log(std.impactRadius + 1);
	//types.shots['StandardShot'] = std;
});

/*
 * The anti-air shot
 */
var AirShot = Shot.extend({
	init: function() {
		this._super(AirShot.speed, 10, AirShot.damage, AirShot.impactRadius);
		this.createVisual(AirShot.sprite, [1, 1, 1, 1], 0.2);
		this.playSound('flak');
	},
}, function(air) {
	air.nickName = 'SAM';
	air.description = 'Surface to air missile that is highly effective.';
	air.sprite = 'airshot';
	air.frames = 4;
	air.speed = 2.5;
	air.damage = 5;
	air.impactRadius = 0.5;
	air.rating = Math.log(air.speed + 1) * air.damage * Math.log(air.impactRadius + 1);
	types.shots['AirShot'] = air;
});

/*
 * The flames
 */
var FlameShot = Shot.extend({
	init: function() {
		this._super(FlameShot.speed, 100, FlameShot.damage, FlameShot.impactRadius);
		this.createVisual(FlameShot.sprite, [8]);
		this.playSound('flames');
	},
}, function(flame) {
	flame.nickName = 'Red Napalm';
	flame.description = "Napalm power you don't want to mess with.";
	flame.sprite = 'flameshot';
	flame.frames = 8;
	flame.speed = 1.5;
	flame.damage = 8;
	flame.impactRadius = 0.5;
	flame.rating = Math.log(flame.speed + 1) * flame.damage * Math.log(flame.impactRadius + 1);
	types.shots['FlameShot'] = flame;
});

/*
 * The shot from hell
 */
var HellShot = Shot.extend({
	init: function() {
		this._super(HellShot.speed, 75, HellShot.damage, HellShot.impactRadius);
		this.createVisual(HellShot.sprite, [12]);
		this.playSound('hellshot');
	},
}, function(hell) {
	hell.nickName = 'HDEB';
	hell.description = 'The High Dark Energy Density is shot by the gate to hell. It catches your soul and gives you the rest.';
	hell.sprite = 'hellshot';
	hell.frames = 12;
	hell.speed = 2.0;
	hell.damage = 300;
	hell.impactRadius = 0.5;
	hell.rating = Math.log(hell.speed + 1) * hell.damage * Math.log(hell.impactRadius + 1);
	types.shots['HellShot'] = hell;
});

/*
 * The icy shot
 */
var IceShot = Shot.extend({
	init: function() {
		this._super(IceShot.speed, 200, IceShot.damage, IceShot.impactRadius);
		this.createVisual(IceShot.sprite, [4]);
		this.playSound('icy');
	},
}, function(ice) {
	ice.nickName = 'Snowball 5';
	ice.description = 'An experimental super cold plasma (cold is relative here).';
	ice.sprite = 'iceshot';
	ice.frames = 4;
	ice.speed = 3.5;
	ice.damage = 15;
	ice.impactRadius = 0.5;
	ice.rating = Math.log(ice.speed + 1) * ice.damage * Math.log(ice.impactRadius + 1);
	types.shots['IceShot'] = ice;
});

/*
 * A shot from the MG nest
 */
var MGShot = Shot.extend({
	init: function() {
		this._super(MGShot.speed, 25, MGShot.damage, MGShot.impactRadius);
		this.createVisual(MGShot.sprite, [1, 1, 1, 1], 0.3);
		this.playSound('mgnest');
	},
}, function(mg) {
	mg.nickName = 'Nato cal. 7.72';
	mg.description = 'Standard MG shot: 7.72 mm full metal jacket that handles most guys.';
	mg.sprite = 'mgshot';
	mg.frames = 4;
	mg.speed = 8.0;
	mg.damage = 2;
	mg.impactRadius = 0.5;
	mg.rating = Math.log(mg.speed + 1) * mg.damage * Math.log(mg.impactRadius + 1);
	types.shots['MGShot'] = mg;
});

/*
 * A laser beam
 */
var LaserShot = Shot.extend({
	init: function() {
		this._super(LaserShot.speed, 25, LaserShot.damage, LaserShot.impactRadius);
		this.createVisual(LaserShot.sprite, [6, 6, 6, 6]);
		this.playSound('laser');
	},
}, function(laser) {
	laser.nickName = 'Faser';
	laser.description = 'Neutrino shot: Hits before fired (from the perspective of any observer).';
	laser.sprite = 'lasershot';
	laser.frames = 24;
	laser.speed = 10;
	laser.damage = 7;
	laser.impactRadius = 0.5;
	laser.rating = Math.log(laser.speed + 1) * laser.damage * Math.log(laser.impactRadius + 1);
	types.shots['LaserShot'] = laser;
});

/*
 * The shell shot
 */
var ShellShot = Shot.extend({
	init: function() {
		this._super(ShellShot.speed, 25, ShellShot.damage, ShellShot.impactRadius);
		this.createVisual(ShellShot.sprite, [1, 1, 1, 1], 0.3);
		this.playSound('artillery');
	},
}, function(shell) {
	shell.nickName = 'Shell';
	shell.description = 'Hardened steel projectile that is no joke.';
	shell.sprite = 'shellshot';
	shell.frames = 4;
	shell.speed = 40;
	shell.damage = 15;
	shell.impactRadius = 0.5;
	shell.rating = Math.log(shell.speed + 1) * shell.damage * Math.log(shell.impactRadius + 1);
	types.shots['ShellShot'] = shell;
});