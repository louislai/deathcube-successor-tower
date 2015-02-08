/*
 * Bot Class
 */
var Bot = Base.extend({
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

var TowerGenerator = function() {
  return [[[Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)], Rock]];
}

var player1 = new Bot([
  [[2, 8], GateToHell],
  [[10, 10], Flak]
], PlayerGenerator, TowerGenerator);