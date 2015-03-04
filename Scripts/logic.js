"use strict";
/*
 * The gamestate enumeration
 * @override
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
 	init: function(view, mazeWidth, mazeHeight, AIPlayerData) {
 		var me = this;
 		me._super();

 		me.width = mazeWidth;
 		me.height = mazeHeight;
 		me.AIPlayerData = AIPlayerData || [new PlayerAI(), new PlayerAI()];

 		me.towers = [];
 		me.units  = [];
 		me.shots  = [];

		me.mediPackHealth   = constants.mediPackHealth;

		me.view            = view;
		me.players         = [new Player(), new Player()];

		// Modification here to switch role between player
		me.defenderSide      = 1;   // Right player defends first
		me.currentDefender      = me.players[1];
		me.currentDefender.side = 1;
		me.currentAttacker      = me.players[0];
		me.currentAttacker.side = 0;

		// Assign sides for AIs
		AIPlayerData[0].__side = 0;
		AIPlayerData[1].__side = 1;

		// Set playerai side attribute to immutable
		Object.defineProperty(AIPlayerData[0], 'side', function() {
			writable: false;
		});
		Object.defineProperty(AIPlayerData[1], 'side', function() {
			writable: false;
		});

		// Tiebreaker when game takes too long
		me.maxRounds = constants.maxRounds;
		me.numRounds = 0;




		me.state         = GameState.unstarted;
		var size         = new Size(mazeWidth, mazeHeight);	
		me.maze          = new Maze(size);
		me.view.mazeSize = me.getMazeSize();

		me.currentWave   = new Wave();

		me.currentDefender.maxTowerNumber = constants.towerNumberMax;

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

		me.currentDefender.addEventListener(events.towerNumberChanged, function(e) {
			me.triggerEvent(events.towerNumberChanged1, e);
		});

		me.currentDefender.addEventListener(events.pointChanged, function(e) {
			me.triggerEvent(events.pointChanged1, e);
		});

		me.currentAttacker.maxTowerNumber = constants.towerNumberMax;

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

		me.currentAttacker.addEventListener(events.towerNumberChanged, function(e) {
			me.triggerEvent(events.towerNumberChanged0, e);
		});

		me.currentAttacker.addEventListener(events.pointChanged, function(e) {
			me.triggerEvent(events.pointChanged0, e);
		});

		me.saveGameState();
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
		me.registerEvent(events.towerNumberChanged0);
		me.registerEvent(events.towerNumberChanged1);
		me.registerEvent(events.pointChanged0);
		me.registerEvent(events.pointChanged1);
	},
	start: function() {		
		if (this.state === GameState.unstarted) {

			this.currentDefender.setHitpoints(constants.hitpoints);
			this.currentDefender.setMoney(constants.money);
			this.currentAttacker.setHitpoints(constants.hitpoints);
			this.currentAttacker.setMoney(constants.money);
			this.currentDefender.triggerEvent(events.towerNumberChanged, {
				current: this.getNumShooting(this.currentDefender),
				maximum: this.currentDefender.maxTowerNumber,
			});
			this.currentAttacker.triggerEvent(events.towerNumberChanged, {
				current: this.getNumShooting(this.currentAttacker),
				maximum: this.currentAttacker.maxTowerNumber,
			});
			this.state = GameState.building;
		}

		if (!this.gameLoop) {
			var me = this;
			this.view.start();
			this.gameLoop = setInterval(function() {
				
				for (var i = 0; i < speedMultiplier; i++) {
					me.tick();
				}

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
	beginGame: function() {
		this.buildInitialTowers();
		this.beginWave();
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
			this.update(this.shots);
			this.update(this.units);
			this.removeDeadObjects();
			var newUnits = this.currentWave.update();

			for (var i = newUnits.length; i--; ) {
				var unit = newUnits[i];
				if (unit) {    // Modifications check that unit is defined
					var path = this.maze.getPath(unit.strategy);
					unit.mazeCoordinates = this.maze.Ustart;
					unit.path = new Path(path);
					this.addUnit(unit);
				}
			}			
		}
	},
	finish: function() {
		this.state = GameState.finished;
		// Should I put these here?
		this.gameLoop = true;
		this.pause();
	},
	getViewSize: function() {
		return this.view.getSize();
	},
	getNumShooting: function(owner) {
		return this.towers.filter(function(tower) {
			return (tower instanceof Rock) === false && tower.owner === owner;
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
	build: function() {
		this.state = GameState.building;

		// build user Tower
		this.generateProgrammedTowers();

		// Reset MazeRecord last units
 		MazeRecord.__lastUnits = [[],[]];

		this.beginWave();
	},
	endWave: function() {
		this.saveGameState();

		var gameOn = this.state !== 3 && this.state !== 0; // Modification to detect if game still laying

		for (var i = this.shots.length; i--; ) {
			this.view.remove(this.shots[i]);
			this.shots.splice(i, 1);
		}

		this.triggerEvent(events.waveDefeated, this.currentWave);

		if (gameOn) { // If game still on
			if (this.numRounds > this.maxRounds &&  this.defenderSide === 0) { // If number of rounds exceed maximum number of rounds
				var player0_points = this.players[0].points;
				var player1_points = this.players[1].points;
				if (player0_points < player1_points ) { // Player 0 lose if have less points
					this.players[0].triggerEvent(events.playerDefeated, this.players[0]);
				} else{
					this.players[1].triggerEvent(events.playerDefeated, this.players[1]);
				}
			} else {
				this.maze.rePosition();

				

				// Reverse map
				this.maze.rotate();

				// Switch attacker and defender
				this.defenderSide = (this.defenderSide + 1) % 2;
				this.currentAttacker = this.players[(this.defenderSide + 1) % 2];
				this.currentDefender = this.players[this.defenderSide];
				
				// Players build towers before player 0 attacks again. Only happen after the 1st round
				if (this.defenderSide == 1) {
					this.build();
				} else {
					this.beginWave();
				}
			}
		} else {
			this.triggerEvent(events.playerDefeated, this.currentDefender); // Trigger playerDefeated event if gameEnd
		}
	},
	beginWave: function() {
		var me = this;

		me.state = GameState.waving;	

		if (me.defenderSide) {
			// Increment Round numbers before both player commence their waves
			me.numRounds++;

			// Regen some amt of money
			me.players[0].addMoney(constants.moneyRegenPerRound);
			me.players[1].addMoney(constants.moneyRegenPerRound);
		}

		var wave = new AIWaveGenerator(this.AIPlayerData[(this.defenderSide + 1) % 2].getUnitGenerator(), this.currentAttacker, this.currentDefender); // Modification generate unit that attacks current defender
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
		
	},
	buildTower: function(owner, target, pt, type) { // Add owner and target for Tower
		var me = this;

		var newTower = new type(owner, target);
		var isrock = newTower instanceof Rock;
		var numShooting = me.getNumShooting(owner);
		if (pt.x <= me.width && pt.x >= 0 && pt.y <= me.height && pt.y >= 0) { // Modification to guarantee point is valid
			if (me.state == GameState.building && type.cost <= me.currentDefender.money && (isrock || (numShooting < owner.maxTowerNumber))) {
				newTower.mazeCoordinates = pt;

				// Prevent player 1 building on player 0 ground
				if (owner === me.players[1] && newTower.mazeCoordinates.x < me.width / 2) {
					return false;
				} 

				// Prevent player 0 building on player 1 ground
				if (owner === me.players[0] && newTower.mazeCoordinates.x >= me.width / 2) {
					return false;
				}
				

				newTower.cost = type.cost;
				newTower.targets = me.units;

				if (me.maze.tryBuild(pt, newTower.mazeWeight)) {
					owner.addMoney(-type.cost);
					this.addTower(newTower);

					if (!isrock) {
						owner.triggerEvent(events.towerNumberChanged, {
							current: numShooting + 1,
							maximum: owner.maxTowerNumber,
						});
						
					}

					return true;
				}
			}
		}

		return false;
	},	
	// build Towers based on User TowerGenerator
	generateProgrammedTowers: function() {
		var me = this;

		// Build Tower for player D
		var nextTowers = (me.AIPlayerData[me.defenderSide].getTowerGenerator())(); // Defender Towers
		me.generateAITower(me.currentDefender, me.currentAttacker, nextTowers);

		// Build Tower for player A
		var nextTowers = (me.AIPlayerData[(me.defenderSide + 1) % 2].getTowerGenerator())(); // Attacker Towers
		me.generateAITower(me.currentAttacker, me.currentDefender, nextTowers);

	},
	generateAITower: function(owner, target, towerlist) {
		var lst = towerlist;
		while (!is_empty_list(lst)) {
			var tw = head(lst);
			if (tw instanceof AITowerToBuild) {
				this.buildTower(owner, target, tw.getCoordinates(), tw.getType());
			} else if (tw instanceof AITowerToDestroy) {
				this.destroyTower(owner, tw.getCoordinates);
			} else {}
			lst = tail(lst);
		}
	},
	destroyTower: function(owner, pt) {
		var me = this;

		if (me.state == GameState.building) {

			var towerToRemove = me.towers.filter(function(t) {
				return t.mazeCoordinates.x === pt.x && t.mazeCoordinates.y === pt.y && t.owner === owner; // Make sure only owner can remove tower
			})[0];

			
			if (towerToRemove && towerToRemove.owner == owner) { // Check owner before destroying towers

				var owner = towerToRemove.owner;
				me.currentDefender.addMoney(0.5 * towerToRemove.cost);
				me.removeTower(towerToRemove);
				me.maze.tryRemove(pt);

				if (!(towerToRemove instanceof Rock)) {
					owner.triggerEvent(events.towerNumberChanged, {
						current: me.getNumShooting(owner),
						maximum: owner.maxTowerNumber,
					});
				}
			}
		}
	},
	saveGameState: function() {
		var me = this;

		MazeRecord.towers = clone(me.towers);
		MazeRecord.players = clone(me.players);
		MazeRecord.maze = clone(me.maze);

		// The following lines are to clone functions required by the path finder not cloneable with json parsing
		MazeRecord.maze.grid = clone(me.maze.grid);
		MazeRecord.maze.getPath = me.maze.getPath.clone();
		MazeRecord.maze.calculate = me.maze.calculate.clone();
		MazeRecord.maze.pf = new PathFinder(MazeRecord.maze.grid);
	},
	buildInitialTowers: function() {
		// Build initial towers for player 0
		var initTowers = this.AIPlayerData[0].getInitTowers();

		this.generateAITower(this.players[0], this.players[1], initTowers);

		// Build initial towers for player 1
		initTowers = this.AIPlayerData[1].getInitTowers();

		this.generateAITower(this.players[1], this.players[0], initTowers);

		this.saveGameState();
	}
});

/*
 * The WAVE
 */
 var Wave = Base.extend({
 	init: function() {
 		this._super();
 		this.startTime = 0;
 		this.units = [];
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

/*
 * The Customized Wave Generator
 */
 var AIWaveGenerator = Wave.extend({
 	init: function(UnitGenerator, owner, target) {
 		this._super();
 		var units = UnitGenerator();
 		this.owner = owner;
 		this.target = target;
 		this.numUnits = Math.min(length(units), constants.maxUnitsPerRound);
 		this.maxtime = 1300 * this.numUnits;
 		this.buildAIUnit(units, 0, this);
 	}, 
 	buildAIUnit: function(unitlist, n, me) {
 		if (!is_empty_list(unitlist) && n < me.numUnits) {
 			var unt = head(unitlist);
 			var type = unt.getType();
 			var time = unt.getTime();
 			if (me.owner.money >= type.cost && time <= me.maxtime) { // Check cost of unit and time does not exceed maxtime
 				this.owner.addMoney(-type.cost);
 				
 				// Save AIUnit to MazeRecord
 				MazeRecord.__lastUnits[this.owner.side] = append(MazeRecord.__lastUnits[this.owner.side], list(new AIUnit(type, time)));

	 			var unit = new type;
	 			unit.owner = me.owner;
	 			unit.target = me.target;
	 			this.add(unit, n === 0 ? 0 : time);
	 			this.buildAIUnit(tail(unitlist), n + 1, me);
	 		}
 		}
 	}
 });
