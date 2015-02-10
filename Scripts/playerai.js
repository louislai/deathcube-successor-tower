/*
 * Bot Class
 */
var PlayerAI = Base.extend({
  init: function(initTowers, unitGenerator, towerGenerator) {
    var initTowers = initTowers || [];
    var unitGenerator = unitGenerator || function() { return; };
    var towerGenerator = towerGenerator || function() { return []; };
    this.getInitTowers = function() { return initTowers; };
    this.getUnitGenerator = function() { return unitGenerator; };
    this.getTowerGenerator = function() { return towerGenerator; };
  }
});

var PlayerGenerator = function() {
  return new FireWizzrobe;
}

var PlayerGenerator1 = function() {
  return new Speedy;
}

var TowerGenerator = function() {
  return [[[Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)], Rock]];
}

var TowerGenerator1 = function() {
  return [[[Math.floor(Math.random() * 10) + 5, Math.floor(Math.random() * 10) + 5], Rock]];
}

var player0 = new PlayerAI([
  [[2, 8], GateToHell],
  [[10, 10], Flak]
], PlayerGenerator, TowerGenerator);

var player1 = new PlayerAI([
  [[17, 8], GateToHell],
  [[27, 10], Flak]
], PlayerGenerator1, TowerGenerator1);