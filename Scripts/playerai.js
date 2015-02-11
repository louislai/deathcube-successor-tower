/*
 * AI Class
 */
var PlayerAI = Base.extend({
  init: function(initTowers, unitGenerator, towerGenerator) {
    var initTowers = initTowers || [];
    var unitGenerator = unitGenerator || function() { return; };
    var towerGenerator = towerGenerator || function() { return []; };
    this.side = undefined
    this.getInitTowers = function() { return initTowers; };
    this.getUnitGenerator = function() { return unitGenerator; };
    this.getTowerGenerator = function() { return towerGenerator; };
  }
});

var PlayerGenerator = function() {
  return new monsters[Math.floor(Math.random() * monsters.length)];
}

var PlayerGenerator1 = function() {
  return new monsters[Math.floor(Math.random() * monsters.length)];
}

function randomTower() {
  return towers[Math.floor(Math.random() * towers.length)];
}

var TowerGenerator = function() {
  return [[new Point(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)), Rock],
          [new Point(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)), randomTower()]];
}

var TowerGenerator1 = function() {
  return [[new Point(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)), Rock],
          [new Point(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)), randomTower()]];
}

// List of monsters and towers for testing
var monsters = [Mario, Rope, DarkNut, Speedy, Armos]
var towers = [Rock, MGNest, CanonTower, FlameTower, IceTower, GateToHell];


var player0 = new PlayerAI([
  [new Point(2, 8), LaserTower]
], PlayerGenerator, TowerGenerator);

var player1 = new PlayerAI([
  [new Point(2, 8), LaserTower]
], PlayerGenerator1, TowerGenerator1);