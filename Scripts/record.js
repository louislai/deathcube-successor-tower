"use strict";
/*
 * MazeRecord
 */

/*
 * Clone function
 */ 

Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};



// To clone object with deep nesting

 function clone(obj) {
  // return JSON.parse(JSON.stringify(obj)); // Work on IE8+, Firefox 34+, Chrome 31+, Safari 7.1+, Opera 26+
  return deepCopy(obj);
 }
 

 function array_to_list(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      result = pair(arr[i], result);
    }
    return result;
 }

 function Towerarr_to_AITowerToBuildlst(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      var tw = arr[i];
      var type = constants.towers[tw.type];
      var coordinates = new Point(tw.mazeCoordinates.x, tw.mazeCoordinates.y) ;
      result = pair(new AITowerToBuild(type, coordinates), result);
    }
    return result;
 }

 function player_to_playerai(player) {
    var p = new PlayerAI();
    p.__side = player.side;
    p.__health = player.hitpoints;
    p.__money = player.money;
    p.__points = player.points;
    p.__shootingTowerNumber = player.shootingTowerNumber;
    return p;
 }

 var MazeRecord = {__lastUnits: [[],[]]};

/*
 * Method to get towers
 */

 MazeRecord.getShootingTowers = function() {
  return (this.towers.filter(
                        function(tower) {
                          return (tower.type !== 0);
                        }
                      ));
 }

 MazeRecord.getRocks = function() {
  return Towerarr_to_AITowerToBuildlst(this.towers.filter(
                        function(tower) {
                          return (tower.type === 0);
                        }
                      ));
 }

 MazeRecord.getSelfShootingTowers = function(aiowner) {
  var side = aiowner.getSide();
  return Towerarr_to_AITowerToBuildlst(this.towers.filter(
                        function(tower) {
                          return tower.type !== 0 && tower.side === side;
                        }
                      ));
 }

 MazeRecord.getSelfRocks = function(aiowner) {
  var side = aiowner.getSide();
  return Towerarr_to_AITowerToBuildlst(this.towers.filter(
                        function(tower) {
                          return tower.type === 0 && tower.side === side;
                        }
                      ));
 }

 MazeRecord.getOpponentShootingTowers = function(aitarget) {
  var side = aitarget.getSide();
  return Towerarr_to_AITowerToBuildlst(this.towers.filter(
                        function(tower) {
                          return tower.type !== 0 && tower.side !== side;
                        }
                      ));
 }

 MazeRecord.getOpponentRocks = function(aitarget) {
  var side = aitarget.getSide();
  return Towerarr_to_AITowerToBuildlst(this.towers.filter(
                        function(tower) {
                          return tower.type === 0 && tower.target !== side;
                        }
                      ));
 }

/*
 * Method to determine the path of a unit that would be generated
 */
 MazeRecord.showGrid = function() {
  return this.maze.grid;
 }

 MazeRecord.findPath = function(side, unit) {
  var path;

  if (side === 0) {
    if (this.maze.isRotated) {
      path = this.maze.getPath(unit.strategy).reverse();
    } else {
      path = this.maze.getPath(unit.strategy);
    }
  } else {
    if (this.maze.isRotated) {
      path = this.maze.getPath(unit.strategy);
    } else {
      path = this.maze.getPath(unit.strategy).reverse();
    }
  }
  return array_to_list(path);
 }

/*
 * Method to view the player info
 */
 MazeRecord.showSelfInfo = function(aiplayer) {
  return player_to_playerai(this.players[aiplayer.__side]);
 }

 MazeRecord.showOpponentInfo = function(aiplayer) {
  return player_to_playerai(this.players[(aiplayer.__side + 1) % 2]);
 }


/*
 * Method to view the last attacking units
 */

 MazeRecord.showLastUnits = function(side) {
  return MazeRecord.__lastUnits[side];
 }

