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
  return list(new AIUnit(monsters[Math.floor(Math.random() * monsters.length)], Math.random() * 1000),
              new AIUnit(monsters[Math.floor(Math.random() * monsters.length)], Math.random() * 2000));
}

var PlayerGenerator1 = function() {
  return list(new AIUnit(Speedy, 0));
}

function randomTower() {
  return towers[Math.floor(Math.random() * towers.length)];
}

var TowerGenerator = function() {
  return list(new AITower(randomTower(), new Point(Math.floor(Math.random() * 15), Math.floor(Math.random() * 15))));
};

var randomPoint = function() {
  return list(new Point(7, 8));
}

// List of monsters and towers for testing
var monsters = [Mario, Rope, DarkNut, Speedy, Armos]
var towers = [Rock, MGNest, CanonTower, FlameTower, IceTower, GateToHell];


var player0 = new PlayerAI(list(new AITower(LaserTower, new Point(7, 8))), PlayerGenerator1, TowerGenerator, randomPoint);

var player1 = new PlayerAI(list(new AITower(LaserTower, new Point(7, 8))), PlayerGenerator1, TowerGenerator, randomPoint);

