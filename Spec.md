#### Tower Defense/Attack Multiplayer Game ####

__Gameplay__: The game has two players, player 1 occupying the left base, player 2 occupying the right base. The game begins by loading up the AIs defined by the players. Then there will be multiple rounds. Each round consists of 2 phases: building phase and waving phase. The building phase occurs first, during which the players will build whatever they want to build. They can destroy their existing building to get back spaces or money during this phase too. Next, during the waving phase, player 1 and 2 take turns to attack each other. The game continues until until someone dies or if the maximum number of rounds is reached.

__AI Specifications__
Each player needs to write his/her own PlayerAI object. An AI Object is called with following parameters:

* InitTowers: This is a list of AITowers to be built before the game start
* UnitGenerator: This is generator that will be invoked to generate the AIUnits to attack the opponent during the player's attacking turn
* TowerGenerator: This is the generator that will be invoked to generate the AITowers to be built during the building phase of each round (Only start from round 2)
* TowerDestroyer: This is the generator that will generate the list of Point to be cleared of towers during the building phase. Note that TowerDestroyer is called before TowerGenerator is called.

__Gamestate Specification__
MazeRecord is the gamestate recorder which can be called with following methods to display the following gamestates:

* getShootingTower: Nullary function. Return the list of the current shooting towers on the map
* getRocks: Nullary function. Return the list of the current rocks on the map
* getSelfShootingTowers: Receive an AIPlayer object as the input. Return
* showGrid: Nullary function. Return a 2D array that represent the status of the map. 1 denotes available cell, 0 denotes occupied cells

