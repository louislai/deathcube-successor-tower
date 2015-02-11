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


var TowerGenerator = function() {
  return [[new Point(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)), Rock],
          [new Point(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)), LaserTower]];
}

var TowerGenerator1 = function() {
  return [[new Point(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)), Rock],
          [new Point(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)), IceTower]];
}


var monsters = [Mario, Rope, AirWolf, DarkNut, Speedy, Armos]
var player0 = new PlayerAI([
  [new Point(2, 8), GateToHell],
  [new Point(10, 10), Flak]
], PlayerGenerator, TowerGenerator);

var player1 = new PlayerAI([
  [new Point(2, 8), LaserTower],
  [new Point(13, 10), Flak]
], PlayerGenerator1, TowerGenerator1);