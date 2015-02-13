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

function AITower(type, pt) {
  var coordinates = pt;
  var type = type;
  this.getType = function() {
    return type;
  };
  this.getCoordinates = function() {
    return coordinates
  }
}

/*
 * AI Class
 */
var PlayerAI = function(initTowers, unitGenerator, towerGenerator, towerDestroyer) {
    var initTowers = initTowers || [];
    var unitGenerator = unitGenerator || function() { return; };
    var towerGenerator = towerGenerator || function() { return []; };
    var towerDestroyer = towerDestroyer || function() { return []; };
    this.side = undefined
    this.getInitTowers = function() { return initTowers; };
    this.getUnitGenerator = function() { return unitGenerator; };
    this.getTowerGenerator = function() { return towerGenerator; };
    this.getTowerDestroyer = function() { return towerDestroyer; };
};

var PlayerGenerator = function() {
  return randomUnit(4, 0);
}

var PlayerGenerator1 = function() {
  return list(new AIUnit(Armos, 0));
}

function randomTower(n) {
  if (n === 0) {
    return [];
  } else {
    return pair(new AITower(towers[Math.floor(Math.random() * towers.length)], 
                new Point(Math.floor(Math.random() * 15), Math.floor(Math.random() * 15))),
                randomTower(n - 1));
  }
}

function randomRock(n) {
  if (n === 0) {
    return [];
  } else {
    return pair(new AITower(Rock, new Point(Math.floor(Math.random() * 15), Math.floor(Math.random() * 15))),
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

var TowerGenerator = function() {
  return append(randomTower(4), randomRock(10));
};

var randomPoint = function() {
  return list(new Point(Math.floor(Math.random() * 15, Math.floor(Math.random() * 15))));
};

// List of monsters and towers for testing
var monsters = [Mario, Rope, DarkNut, Speedy, Armos]
var towers = [Rock, MGNest, CanonTower, FlameTower, IceTower, GateToHell];


var player0 = new PlayerAI(list(new AITower(LaserTower, new Point(7, 8))), PlayerGenerator1);

var player1 = new PlayerAI(list(new AITower(LaserTower, new Point(7, 8))), PlayerGenerator1);

