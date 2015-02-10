"use strict";
/*
 * The gamestate enumeration
 */
var GameState = {
	unstarted : 0,
	building : 1,
	waving : 2,
	finished : 3,
};

/* 
 * Global objects
 */
var types = {
	units : {},
	towers : {},
	shots : {},
};

/*
 * The GAME
 */
var GameLogic = Base.extend({
	init: function(view, mazeWidth, mazeHeight, playerData) {
		var me = this;
		me._super();
		
		me.width = mazeWidth;
		me.height = mazeHeight;
		me.playerData = playerData || new PlayerAI();

		me.towers = [];
		me.units  = [];
		me.shots  = [];

		
		me.mediPackCost     = constants.mediPackCost;
		me.mediPackFactor   = constants.mediPackFactor;
		me.towerBuildCost   = constants.towerBuildCost;
		me.towerBuildFactor = constants.towerBuildFactor;
		me.maxTowerNumber   = constants.towerBuildNumber;
		me.mediPackHealth   = constants.mediPackHealth;

		me.view            = view;
		me.players         = [new Player(), new Player()];
		// Modification here to switch role between player
		me.playerTurn      = 0;
		me.currentDefender = me.players[me.playerTurn];
		me.currentAttacker = me.players[me.playerTurn + 1];

		

		me.state         = GameState.unstarted;
		var size         = new Size(mazeWidth, mazeHeight);	
		me.maze          = new Maze(size);
		me.view.mazeSize = me.getMazeSize();

		// Modification change WaveList to UnitGenerator
		// me.waves         = new WaveList();
		// me.waves         = new WaveGenerator();
		// me.waves.assignGenerator(playerData.getUnitGenerator());
		// End Modification
		me.currentWave   = new Wave();

		me.currentDefender.addEventListener(events.playerDefeated, function(e) {
			me.triggerEvent(events.playerDefeated1, e);
			me.finish();
		});

		me.currentDefender.addEventListener(events.moneyChanged, function(e) {
			me.triggerEvent(events.moneyChanged1, e);
		});

		me.currentDefender.addEventListener(events.healthChanged, function(e) {
			me.triggerEvent(events.healthChanged1, e);
		});

		me.currentAttacker.addEventListener(events.playerDefeated, function(e) {
			me.triggerEvent(events.playerDefeated0, e);
			me.finish();
		});

		me.currentAttacker.addEventListener(events.moneyChanged, function(e) {
			me.triggerEvent(events.moneyChanged0, e);
		});

		me.currentAttacker.addEventListener(events.healthChanged, function(e) {
			me.triggerEvent(events.healthChanged0, e);
		});
		me.registerEvent(events.refreshed);
		me.registerEvent(events.waveDefeated);
		me.registerEvent(events.waveFinished);
		me.registerEvent(events.playerDefeated0);
		me.registerEvent(events.playerDefeated1);
		me.registerEvent(events.moneyChanged0);
		me.registerEvent(events.moneyChanged1);
		me.registerEvent(events.healthChanged0);
		me.registerEvent(events.healthChanged1);
		me.registerEvent(events.waveCreated);
		me.registerEvent(events.unitSpawned);
		me.registerEvent(events.towerNumberChanged);
		me.registerEvent(events.towerNumberChanged0);
		me.registerEvent(events.towerNumberChanged1);
	},
	start: function() {		
		if (this.state === GameState.unstarted) {
			this.currentDefender.setHitpoints(constants.hitpoints);
			this.currentDefender.setMoney(constants.money);
			this.currentAttacker.setHitpoints(constants.hitpoints);
			this.currentAttacker.setMoney(constants.money);
			this.triggerEvent(events.towerNumberChanged, {
				current: this.getNumShooting(),
				maximum: this.maxTowerNumber,
			});
			this.state = GameState.building;
		}

		if (!this.gameLoop) {
			var me = this;
			this.view.start();
			this.gameLoop = setInterval(function() {
				me.tick();
			}, constants.ticks);	
		}
	},
	pause: function() {
		if (this.gameLoop) {
			this.view.pause();
			clearInterval(this.gameLoop);
			this.gameLoop = undefined;	
		}
	},
	update: function(objects) {
		for (var i = objects.length; i--; ) {
			objects[i].update();
		}
	},
	tick: function() {
		if (this.state !== GameState.building && this.state !== GameState.waving)
			return;

		this.update(this.towers);
		if (this.state === GameState.waving) {
			// Modification for units to be aware of new rocks
			// var allUnits = this.units;

			// for (var i = allUnits.length; i--; ) {
			// 	var unit = allUnits[i];
			// 	var mazeCoordinates = unit.mazeCoordinates;
			// 	// console.log(mazeCoordinates);;
			// 	var path = this.maze.getPath(unit.strategy, Math.ceil(mazeCoordinates));
			// 	unit.path = new Path(path);			
			// }

			// End Modifications

			this.update(this.shots);
			this.update(this.units);
			this.removeDeadObjects();
			var newUnits = this.currentWave.update();

			 
			for (var i = newUnits.length; i--; ) {
				var unit = newUnits[i];
				if (unit) {    // Modifcations check that unit is defined
					var path = this.maze.getPath(unit.strategy);
					unit.mazeCoordinates = this.maze.start;
					unit.path = new Path(path);
					this.addUnit(unit);
				}
			}
			/* Modifications to build new towers on demand */
			// if (this.timer % this.towerTimer == 0) {
			// 	var nextTowers = (this.playerData.getTowerGenerator())();
			// 	for(var i = 0; i < nextTowers.length; i++) {
			// 		var Towerinfo = nextTowers[i];
			// 		if (Towerinfo) {
			// 			this.buildTower(new Point(Math.round(Towerinfo[0][0]), Math.round(Towerinfo[0][1])), Towerinfo[1]);
			// 		}
			// 	}
			// }
			// this.timer++;
			/* End Modifications*/

			// Modifications to update gamestate
			var towers = this.towers;
			GameRecord.rocks = [];
			GameRecord.towers = [];
			for (var i=0; i < towers.length; i++) {
				if (towers[i] instanceof Rock) {
					GameRecord.rocks.push(towers[i]);
				} else {
					GameRecord.towers.push(towers[i]);
				}
			}
			GameRecord.units = this.units;
		}
	},
	finish: function() {
		this.state = GameState.finished;
	},
	getViewSize: function() {
		return this.view.getSize();
	},
	getNumShooting: function() {
		return this.towers.filter(function(tower) {
			return (tower instanceof Rock) === false;
		}).length;
	},
	getMazeSize: function() {
		return this.maze.gridDim;
	},
	transformCoordinates: function(screenX, screenY) {
		var x = screenX * this.maze.gridDim.width / this.view.width;
		var y = screenY * this.maze.gridDim.height / this.view.height;
		return new Point(~~x, ~~y);
	},
	removeTower: function(tower) {
		tower.removeEventListener(events.shot);
		this.towers.splice(this.towers.indexOf(tower), 1);
		this.view.remove(tower);
	},
	addTower: function(tower) {
		var me = this;
		tower.addEventListener(events.shot, function(shot) {
			me.addShot(shot);
		});
		me.towers.push(tower);
		me.view.add(tower);
	},
	addShot: function(shot) {
		this.shots.push(shot);
		this.view.add(shot);
	},
	addUnit: function(unit) {
		var me = this;
		unit.addEventListener(events.accomplished, function(unt) {
			var player = unt.target;
			player.hit(unt); // Modification to only hit target of unit
			console.log(this.players);
			// if (player.getHitpoints() == 0) { 
			// 	this.triggerEvent(events.playerDefeated, player);
			// 	this.finish();
			// } // Modification trigger PlayerDefeated event if hitpoint is 0
		});
		unit.playInitSound();
		me.units.push(unit);
		me.view.add(unit);
	},
	removeDead: function(objects) {
		for (var i = objects.length; i--; ) {
			if (objects[i].dead) {
				this.view.remove(objects[i]);
				objects.splice(i, 1);
			}
		}
	},
	removeDeadObjects: function() {
		var a = this.state;
		this.removeDead(this.towers);
		this.removeDead(this.shots);
		this.removeDead(this.units);

		if (this.currentWave.finished && this.units.length === 0)
			this.endWave();
	},
	endWave: function() {
		var gameOn = this.state !== 3; // Modification to detect if game not finished
		this.currentDefender.addMoney(this.currentWave.prizeMoney);
		this.state = GameState.building;

		for (var i = this.shots.length; i--; ) {
			this.view.remove(this.shots[i]);
			this.shots.splice(i, 1);
		}

		this.triggerEvent(events.waveDefeated, this.currentWave);

		if (gameOn) {
			// Swap start and end points
			console.log('hello');

			this.maze.rePosition();

			// Modifications to build user Tower
			this.buildProgrammedTowers();

			// Reverse map
			this.maze.rotate();

			// Switch attacker and defender
			this.playerTurn = (this.playerTurn + 1) % 2;
			console.log("here " + this.players);
			this.currentAttacker = this.players[(this.playerTurn + 1) % 2];
			this.currentDefender = this.players[this.playerTurn];
			// console.log(JSON.stringify(this.currentDefender));
			// console.log(JSON.stringify(this.currentAttacker));

			this.beginWave(); // Modification to run wave continuously
		 } else {
			this.triggerEvent(events.playerDefeated, this.currentDefender); // Trigger playerDefeated event if gameEnd
		}
	},
	beginWave: function() {
		if (this.state === GameState.building) {
			var me = this;
			
			// End Modification

			me.state = GameState.waving;	
			//var wave = me.waves.next(this.currentDefender); // Modification to test with player 1 
			var wave = new AIWaveGenerator(this.playerData.getUnitGenerator(), this.currentDefender); // Modification generate unit that attacks current defender
			console.log(JSON.stringify(this.currentDefender));
			wave.addEventListener(events.waveFinished, function() {
				me.triggerEvent(events.waveFinished);
				wave.removeEventListener(events.waveFinished);
				wave.removeEventListener(events.unitSpawned);
			});
			wave.addEventListener(events.unitSpawned, function(e) {
				me.triggerEvent(events.unitSpawned, e);
			});
			me.triggerEvent(events.waveCreated, wave);
			me.currentWave = wave;
		}
	},
	buildTower: function(pt, type) {
		var newTower = new type();
		var isrock = newTower instanceof Rock;
		var numShooting = this.getNumShooting();
		if (pt.x <= this.width && pt.x >= 0 && pt.y <= this.height && pt.y >= 0) { // Modification to guarantee point is valid
			if (this.state == GameState.building && type.cost <= this.currentDefender.money && (isrock || (numShooting < this.maxTowerNumber))) {
				newTower.mazeCoordinates = pt;
				newTower.cost = type.cost;
				newTower.targets = this.units;

				if (this.maze.tryBuild(pt, newTower.mazeWeight)) {
					this.currentDefender.addMoney(-type.cost);
					this.addTower(newTower);

					if (!isrock) {
						this.triggerEvent(events.towerNumberChanged0, {
							current: numShooting + 1,
							maximum: this.maxTowerNumber,
						});
						this.triggerEvent(events.towerNumberChanged1, {
							current: numShooting + 1,
							maximum: this.maxTowerNumber,
						});
						
					}

					return true;
				}
			}
		}

		return false;
	},
	// Modification to build Towers based on User TowerGenerator
	buildProgrammedTowers: function() {
		var nextTowers = (this.playerData.getTowerGenerator())();
		for(var i = 0; i < nextTowers.length; i++) {
			var Towerinfo = nextTowers[i];
			if (Towerinfo) {
				this.buildTower(new Point(Math.round(Towerinfo[0][0]), Math.round(Towerinfo[0][1])), Towerinfo[1]);
			}
		}
			
	},
	destroyTower: function(pt) {
		if (this.state == GameState.building) {
			var towerToRemove = this.towers.filter(function(t) {
				return t.mazeCoordinates.x === pt.x && t.mazeCoordinates.y === pt.y;
			})[0];

			if (towerToRemove) {
				this.currentDefender.addMoney(0.5 * towerToRemove.cost);
				this.removeTower(towerToRemove);
				this.maze.tryRemove(pt);

				if (!(towerToRemove instanceof Rock)) {
						this.triggerEvent(events.towerNumberChanged0, {
							current: this.getNumShooting(),
							maximum: this.maxTowerNumber,
						});
						this.triggerEvent(events.towerNumberChanged1, {
							current: this.getNumShooting(),
							maximum: this.maxTowerNumber,
						});
				}
			}
		}
	},
	buyMediPack: function() {
		var cost = this.mediPackCost;

		if (this.currentDefender.money > cost) {
			this.currentDefender.addHitpoints(this.mediPackHealth);
			this.mediPackCost = ~~(this.mediPackFactor * cost);
			this.currentDefender.addMoney(-cost);
			return true;
		}

		return false;
	},
	buyTowerBuildRight: function() {
		var cost = this.towerBuildCost;

		if (this.currentDefender.money > cost) {
			var numShooting = this.getNumShooting();
			this.maxTowerNumber++;

			
			this.triggerEvent(events.towerNumberChanged0, {
				current: numShooting,
				maximum: this.maxTowerNumber,
			});
			this.triggerEvent(events.towerNumberChanged1, {
				current: numShooting,
				maximum: this.maxTowerNumber,
			});

			this.towerBuildCost = ~~(this.towerBuildFactor * cost);
			this.currentDefender.addMoney(-cost);
			return true;
		}

		return false;
	},
});

/*
 * The WAVELIST
 */
var WaveList = Class.extend({
	init: function() {
		this.waves = [];
		this.index = 0;
		this.unitNames = Object.keys(types.units);
	},
	random: function() {
		var wave = new Wave();
		var n = rand(Math.max(~~(this.index * 0.5), 1), this.index);
		var maxtime = 1300 * n;
		wave.prizeMoney = n;

		for (var i = 0; i < n; ++i) {
			var j = rand(0, Math.min(this.unitNames.length, ~~(this.index * 0.2) + 1));
			var name = this.unitNames[j];
			var unit = new (types.units[name])();
			wave.add(unit, i === 0 ? 0 : rand(0, maxtime));
		}

		return wave;
	},
	next: function() {
		if (this.index < this.waves.length)
			return this.waves[this.index++];

		++this.index;
		return this.random();
	},
});

/*
 * The WAVE
 */
var Wave = Base.extend({
	init: function() {
		this._super();
		this.startTime = 0;
		this.units = [];
		this.prizeMoney = 0;
		this.finished = false;
		this.registerEvent(events.unitSpawned)
		this.registerEvent(events.waveFinished);
	},
	add: function(unit, time) {
		this.units.push({
			time: time,
			unit: unit
		});
	},
	update: function() {
		var unitsToSpawn = [];

		if (!this.finished) {
			for (var i = this.units.length; i--; ) {
				if (this.units[i].time < this.startTime) {
					unitsToSpawn.push(this.units[i].unit);
					this.units.splice(i, 1);
				}
			}

			if (this.units.length === 0) {
				this.finished = true;
				this.triggerEvent(events.waveFinished);
			}

			if (unitsToSpawn.length > 0) {
				var remaining = this.units.length;
				this.triggerEvent(events.unitSpawned, remaining); 				
			}

			this.startTime += constants.ticks;
		}

		return unitsToSpawn;
	},
});

// Modification

/*
 * The Customized Wave Generator
 */
var AIWaveGenerator = Wave.extend({
	init: function(UnitGenerator, target) {
		this._super();
		var numUnits = 2;
		var maxtime = 1300 * numUnits;
		for (var i = 0; i < numUnits; ++i) {
			var unit = new Speedy;
			unit.target = target;
			this.add(unit, i === 0 ? 0 : rand(0, maxtime));
		}
	}
});
