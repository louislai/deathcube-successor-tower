"use strict";
// Use Object.defineProperty, supported in IE 9+, Chrome 5+, Firefox 4+, Opera 11.6+, Safari 5.1+

/*
 * Global constants
 */
var constants = {
	ticks: 25, // Default is 25. DO NOT CHANGE THIS
	speedMultiplier: 1, // Use this to increase speed. Should not exceed 50x
	maxUnitsPerRound: 8,
	money : 1000,
	moneyRegenPerRound : 10,
	hitpoints : 30,
	mediPackCost : 5,
	mediPackFactor : 1.5,
	mediPackHealth : 1,
	towerBuildCost : 5,
	towerBuildFactor : 1.85,
	towerBuildNumber : 10,
	maxRounds: 10000 // 0  means 1 round
};


/*
 * A list of possible events
 */
var events = {
	click: 'click',
	mousemove: 'mousemove',
	mouseover: 'mouseover',
	mouseout: 'mouseout',
	contextmenu: 'contextmenu',
	died: 'died',
	shot: 'shot',
	hit: 'hit',
	accomplished : 'accomplished',
	playerDefeated0 : 'playerDefeated0',
	playerDefeated1 : 'playerDefeated1',
	playerDefeated : 'playerDefeated',
	moneyChanged0 : 'moneyChanged0',
	moneyChanged1 : 'moneyChanged1',
	moneyChanged : 'moneyChanged',
	waveCreated : 'waveCreated',
	waveFinished : 'waveFinished',
	waveDefeated : 'waveDefeated',
	healthChanged0 : 'healthChanged0',
	healthChanged1 : 'healthChanged1',
	healthChanged : 'healthChanged',
	unitSpawned : 'unitSpawned',
	towerNumberChanged : 'towerNumberChanged',
	towerNumberChanged0 : 'towerNumberChanged0',
	towerNumberChanged1 : 'towerNumberChanged1',
};

/*
 * The images to load
 */
var resources = {
	images : [
		{ name : 'background', value : 'Content/background.png' },
		{ name : 'airshot', value : 'Content/sprites/airshot.png' },
		{ name : 'airwolf', value : 'Content/sprites/airwolf.png' },
		{ name : 'armos', value : 'Content/sprites/armos.png' },
		{ name : 'canontower', value : 'Content/sprites/canontower.png' },
		{ name : 'darknut', value : 'Content/sprites/darknut.png' },
		{ name : 'firewizzrobe', value : 'Content/sprites/firewizzrobe.png' },
		{ name : 'flak', value : 'Content/sprites/flak.png' },
		{ name : 'flameshot', value : 'Content/sprites/flameshot.png' },
		{ name : 'flametower', value : 'Content/sprites/flametower.png' },
		{ name : 'gatetohell', value : 'Content/sprites/gatetohell.png' },
		{ name : 'hellshot', value : 'Content/sprites/hellshot.png' },
		{ name : 'iceshot', value : 'Content/sprites/iceshot.png' },
		{ name : 'icetower', value : 'Content/sprites/icetower.png' },
		{ name : 'lasershot', value : 'Content/sprites/lasershot.png' },
		{ name : 'lasertower', value : 'Content/sprites/lasertower.png' },
		{ name : 'mgnest', value : 'Content/sprites/mgnest.png' },
		{ name : 'mgshot', value : 'Content/sprites/mgshot.png' },
		{ name : 'newunit', value : 'Content/sprites/newunit.png' },
		{ name : 'rock', value : 'Content/sprites/rock.png' },
		{ name : 'rope', value : 'Content/sprites/rope.png' },
		{ name : 'shellshot', value : 'Content/sprites/shellshot.png' },
		{ name : 'suns', value : 'Content/sprites/suns.png' },
		{ name : 'sunshot', value : 'Content/sprites/sunshot.png' },
		{ name : 'mario', value : 'Content/sprites/mario.png' },
	],
	sounds : [
		{ name : 'hold_the_line', value : { ogg : 'Content/music/hold_the_line.ogg', mp3 : 'Content/music/hold_the_line.mp3' }},
		{ name : 'burn_them_down', value : { ogg : 'Content/music/burn_them_down.ogg', mp3 : 'Content/music/burn_them_down.mp3' }},
		{ name : 'ak47-1', value : { ogg : 'Content/effects/ak47-1.ogg', mp3 : 'Content/effects/ak47-1.mp3' }},
		{ name : 'artillery', value : { ogg : 'Content/effects/artillery.ogg', mp3 : 'Content/effects/artillery.mp3' }},
		{ name : 'explosion', value : { ogg : 'Content/effects/explosion.ogg', mp3 : 'Content/effects/explosion.mp3' }},
		{ name : 'flak', value : { ogg : 'Content/effects/flak.ogg', mp3 : 'Content/effects/flak.mp3' }},
		{ name : 'flames', value : { ogg : 'Content/effects/flames.ogg', mp3 : 'Content/effects/flames.mp3' }},
		{ name : 'hellshot', value : { ogg : 'Content/effects/hellshot.ogg', mp3 : 'Content/effects/hellshot.mp3' }},
		{ name : 'humm', value : { ogg : 'Content/effects/humm.ogg', mp3 : 'Content/effects/humm.mp3' }},
		{ name : 'icy', value : { ogg : 'Content/effects/icy.ogg', mp3 : 'Content/effects/icy.mp3' }},
		{ name : 'laser', value : { ogg : 'Content/effects/laser.ogg', mp3 : 'Content/effects/laser.mp3' }},
		{ name : 'laugh', value : { ogg : 'Content/effects/laugh.ogg', mp3 : 'Content/effects/laugh.mp3' }},
		{ name : 'mgnest', value : { ogg : 'Content/effects/mgnest.ogg', mp3 : 'Content/effects/mgnest.mp3' }},
		{ name : 'wowpulse', value : { ogg : 'Content/effects/wowpulse.ogg', mp3 : 'Content/effects/wowpulse.mp3' }},
	],
}

// Make all constant values un-writable
for (var prop in constants) {
 // Set property (+descriptor)
 Object.defineProperty(constants, prop, {
     writable: false
 });
}

for (var prop in events) {
 // Set property (+descriptor)
 Object.defineProperty(events, prop, {
     writable: false
 });
}

for (var prop in resources) {
 // Set property (+descriptor)
 Object.defineProperty(resources, prop, {
     writable: false
 });
}