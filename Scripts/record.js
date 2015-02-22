"use strict";
/*
 * MazeRecord
 */

 function clone(obj) {
  return JSON.parse(JSON.stringify(obj)); // Work on IE8+, Firefox 34+, Chrome 31+, Safari 7.1+, Opera 26+
 }
 
 function array_to_list(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      result = pair(arr[i], result);
    }
    return result;
 }

 var MazeRecord = {};

/*
 * Method to get towers
 */

 MazeRecord.getShootingTowers = function() {
  return array_to_list(this.towers.filter(
                        function(tower) {
                          return !(tower instanceof Rock);
                        }
                      ));
 }

 MazeRecord.getRocks = function() {
  return array_to_list(this.towers.filter(
                        function(tower) {
                          return (tower instanceof Rock);
                        }
                      ));
 }

 MazeRecord.getSelfShootingTowers = function(owner) {
  var real_owner = this.players[owner.side];
  return array_to_list(this.towers.filter(
                        function(tower) {
                          return !(tower instanceof Rock) && tower.owner === real_owner;
                        }
                      ));
 }

 MazeRecord.getRocks = function(owner) {
  var real_owner = this.players[owner.side];
  return array_to_list(this.towers.filter(
                        function(tower) {
                          return (tower instanceof Rock) && tower.owner === real_owner;
                        }
                      ));
 }

 MazeRecord.getOpponentShootingTowers = function(target) {
  var real_target = this.players[target.side];
  return array_to_list(this.towers.filter(
                        function(tower) {
                          return !(tower instanceof Rock) && tower.target === real_target;
                        }
                      ));
 }

 MazeRecord.getOpponentRocks = function(target) {
  var real_target = this.players[target.side];
  return array_to_list(this.towers.filter(
                        function(tower) {
                          return (tower instanceof Rock) && tower.target === real_target;
                        }
                      ));
 }

/*
 * Method to determine the path of a unit that would be generated
 */
 MazeRecord.showGrid = function() {
  return this.maze.grid;
 }

 MazeRecord.findPath = function(unit) { // This one may cause private variable to be overridden
  var player = unit.owner; 
  var path;
  // Return original path if owner is player 0
  if (player === this.players[0]) {
    path = this.maze.getPath(unit.strategy);
  } else {
    path = this.maze.getPath(unit.strategy).reverse();
  }
  return path;
 }

/*
 * Method to view the player info
 */
 MazeRecord.showSelfInfo = function(player) {
  return this.players[player.side];
 }

 MazeRecord.showOpponentInfo = function(player) {
  return this.players[(player.side + 1) % 2];
 }


