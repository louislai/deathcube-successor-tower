/*
 * Define AIUnit Class
 * Using JediScript
 */

function AIUnit(type, time) {
  var type = type;
  var time = time;
  this.getType = function() {
    return type;
  };
  this.getTime = function() {
    return time;
  };
}

/*
 * Define AITower Class
 * Using JediScript
 */

function AITowerToBuild(type, pt) {
  var coordinates = pt;
  var type = type;
  this.getType = function() {
    return type;
  };
  this.getCoordinates = function() {
    return coordinates
  }
}

function AITowerToDestroy(pt) {
  var coordinates = pt;
  this.getCoordinates = function() {
    return coordinates
  }
}

/*
 * AI Class
 */
var PlayerAI = function(name, initTowers, unitGenerator, towerGenerator, towerDestroyer) {
    var initTowers = initTowers || [];
    var unitGenerator = unitGenerator || function() { return; };
    var towerGenerator = towerGenerator || function() { return AITowerList(); };
    var name = name;

    this.__side = undefined;
    this.getInitTowers = function() { return initTowers; };
    this.getUnitGenerator = function() { return unitGenerator; };
    this.getTowerGenerator = function() { return towerGenerator; };
    this.getSide = function() { return this.__side; };
    this.getName = function() { return name; };
};

var PlayerGenerator = function() {
  return randomUnit(4, 0);
}

var PlayerGenerator1 = function() {
  return list(new AIUnit(Speedy, 0));
}

function randomTower(n) {
  if (n === 0) {
    return [];
  } else {
    return pair(new AITowerToBuild(towers[Math.floor(Math.random() * towers.length)], 
                new Point(Math.floor(Math.random() * 15), Math.floor(Math.random() * 15))),
                randomTower(n - 1));
  }
}

function randomRock(n) {
  if (n === 0) {
    return [];
  } else {
    return pair(new AITowerToBuild(Rock, new Point(Math.floor(Math.random() * 15), Math.floor(Math.random() * 15))),
                randomRock(n - 1));
  }
}
function randomUnit(n, t) {
  if (n === 0) {
    return [];
  } else {
    return pair(new AIUnit(monsters[Math.floor(Math.random() * monsters.length)], Math.random() + t),
                randomUnit(n - 1, t + 1300));
  }
}

var presetRock0 = [[2, 1], [5, 0], [8, 1], [11, 0], [13, 1]];
var presetRock1 = [[1, 0], [3, 1], [6, 0], [9, 1], [12, 0]];

var TowerGenerator = function() {
  return append(append(randomTower(4), randomRock(10)), rn());
};

function randomPoint(n) {
  if (n === 0) { 
    return [];
  } else {
    return pair(new AITowerToDestroy(Math.floor(Math.random() * 15, Math.floor(Math.random() * 15))),
                randomPoint(n - 1));
  }
};

function rn() {
  return randomPoint(20);
}


function numberToPoint(lst) {
  var pts = [];
  for (var i=0; i < lst.length; i++) {
    for (var j= lst[i][1]; j < 14; j++) {
      pts = pair(new AITowerToBuild( Rock, new Point(lst[i][0], j)), pts);
    }
    if (lst[i][1] !== 0) {
      pts = pair(new AITowerToBuild( Rock, new Point(lst[i][0], 14)), pts);
    }
  }
  return pts;
}


// List of monsters and towers for testing
var monsters = [Mario, Rope, DarkNut, Speedy, Armos]
var towers = [Rock, MGNest, CanonTower, FlameTower, IceTower, GateToHell];

var initTowers0 = pair(new AITowerToBuild(LaserTower, new Point(7, 8)), numberToPoint(presetRock0));
var initTowers1 = pair(new AITowerToBuild(LaserTower, new Point(7, 8)), numberToPoint(presetRock1));

var player0 = new PlayerAI("Yoda", initTowers0, PlayerGenerator, TowerGenerator);

var player1 = new PlayerAI("Darth Vader", initTowers1, PlayerGenerator, TowerGenerator);
  
