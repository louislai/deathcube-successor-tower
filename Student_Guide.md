#### Tower Defense/Attack Multiplayer Game ####

__Gameplay__: The game has two players, player 1 occupying the left half of the map, player 2 occupying the right half. The two player are controlled by two AI programs to be written by the student. In this game, the two players will take part in both sending out soldier to attack the opponent's base and building towers to defend themselves against each other's attack. There are multiple rounds. Each round consists of 2 phases: building phase and waving phase. The building phase occurs first, during which the players will prepare their towers. Next, during the waving phase, player 1 and 2 take turns to attack each other. The game continues until until someone dies or if the maximum number of rounds is reached.

__Victory Condition__:  
A player becomes the winner when his opponent lost all HP, or if the maximum number of rounds is reached. In the latter case, the points of two players are compared. And the one with higher point win (In case that two players have the same point, player 1 wins). The points are based on the player's current health and current money amount.

__The Phases:__  
_Building Phase_  
This is the 'preparation' part of a round. This phase is when the engine will call the players' AI program to generate the towers, create mazes, destroy existing towers, etc

_Waving Phase_  
This is the 'action' part of a round. In this phase, player 1 will attack player 2 first with his group of soldier. After all of player 1's soldier either successfully reach player 2's base or perish, player 2 will attack player 1.  
 Throughout the phase, the engine will call the players' ai programs to generate the soldiers to be sent out. One player's attacker can have at most 8 soldiers attacking, and can last as long as (number of units * 1300) time units.  The list of units that would be sent out during a player's attack turn is generated at the start of the turn based on the AI's algorithm.  Students should test out how each type of unit move differently.
Note that the path to be travelled by a unit is determined by the game engine. Each unit can take one out of 5 maze-traversing strategies: Manhattan, MaxDXDY, DiagonalShortcut, Euclidean and EuclideanNoSQR).  
Also note the coloured squares on the left and the right only represent the spawning points for the units. The players should not assume that his opponent's soldier needs to reach exactly the coloured square on the his side to damage him. In fact, anywhere along the left or right edge is fair game.


__The Interface__:  
The top of the screen is the info bar, displaying the info of each player, including the name,  current HP, current number of shooting tower over the maximum allowed number of shooting towers, and the current point.  
Below the screen lies a canvas containing the game map. On the map, the left half is controlled by player 1, while the right half is controlled by player 2, and the two halves are separated by the boundary line. The coordinates start from (0, 0) from the top left, and increase to the maximum coordinates at the right bottom.

__AI APIs__  
Here are the classes/constructors that players need to be aware of:  

_Point_: can be instanized with 2 parameters: x-coordinate and y-coordinate  (e.g. new Point(0, 0)).

_AITowerToBuild_: This can be instanized with 2 parameters: the tower type, and a Point defining the coordinates of the tower on the map (e.g. new AITowerToBuild(Rock, new Point(0, 0))). This constructs a tower object to be built on the map. Note that the coordinates of the tower need to be valid. 

_AITowerToDestroy_: This class is instanized with 1 parameter: the coordinates of an existing tower to be destroyed on the map. Note that the coordinates of the tower need to be valid. 

_AIUnit_: This class can be instanized with 2 parameters: the unit type, and the time instance to send the unit out (e.g. new AIUnit(Mario, 0)). The time instance is when to send the unit out during the player's attack turn during the waving phase. As mentioned, a player's attack turn can last as long as (number of units * 1300) time units. So the time instance can be any integer between 0 and the time cap.

_PlayerAI_: This is the main AI class the players need to subclass. An AI Object is called with following parameters, in order:  

* Name: What the player wants be called as
* InitTowers: This is a list of AITowersToBuild objects to be built at the start of the game. Ideally this should be used to set up the maze. 
* UnitGenerator: This is the generator that will be invoked to generate an AIUnit object to attack the opponent during a player's attack turn.
* TowerGenerator: This is the generator that will be invoked to generate the list of AITowerToBuild and AITowerToDestroy objects to be built by each player during the building phase of each round. This only begins to be called from round 2 onwards. Note that each player can only have a maximum of a certain number of shooting towers on the map at any one time.

_(Special Note:)_: Players need to spend money to buy a tower or unit, but will gain back some money if they destroy their towers or if they kill an enemy unit.

__Gamestate APIs__  
MazeRecord is the game state holder that will be prove useful to the players in determining the current state of the game. This can also serve as strategic aid for the AI programs' generators

MazeRecord contains the following methods:  

* getShootingTowers(): Return the list of the current shooting towers on the map (Shooting towers are any types of offensive towers aside from Rock )
* getRocks(): Return the list of the current rocks on the map/
* getSelfShootingTowers(playerai): Return the current shooting towers on the map of a player
* getSelfRocks(playerai): Return the current rocks on the map of a player
* getOpponentShootingTowers(playerai): Return the current shooting towers on the map of a player's opponent
* getOpponentRocks(playerai): Return the current rocks on the map of a player's opponent
* showLastUnits(side): Return the list of the last units sent out by a side during the the side's most recent attack turn. (Player 1's side is 0. Player 2's side is 1).
* showGrid: Nullary function. Return a 2D array that represent the status of the map. 1 denotes available cell, 0 denotes occupied cells
* findPath(side, unit): Return a list of points that represent that path that the unit would take in the map if it was sent by a side.  (Player 1's side is 0. Player 2's side is 1).

__Types of Units__:  
There are altogether 6 types of units that a player can use as soldiers:   

* Mario:  
	* Speed: 2.5
	* HP: 150
	* Cost: 2
	* Prize: 1
* Rope:  
	* Speed: 2
	* HP: 20
	* Cost: 3
	* Prize: 2
* FireWizzRobe:  
	* Speed: 3
	* HP: 30
	* Cost: 6
	* Prize: 5
* DarkNut:  
	* Speed: 2.5
	* HP: 150
	* Cost: 20
	* Prize: 19
* Speedy:
	* Speed: 7
	* HP: 200
	* Cost: 56
	* Prize: 45
* Armos:  
	* Speed: 1
	* HP: 600
	* Cost: 41
	* Prize: 40

__Types of Towers__:  
There are altogether 8 types of towers player can use to defend himself.  

* Rock: Rock are just building blocks for players to build the wall for their maze
	* Cost: 1
* MGNest:
	* Speed: 4
	* Range: 4
	* Damage per shot: 2
	* Shot speed: 8
	* Cost: 3
* CanonTower:
	* Speed: 1
	* Range: 8
	* Damage per shot: 15
	* Shot speed: 40
	* Cost: 9
* FlameTower:
	* Speed: 6
	* Range: 2
	* Damage per shot: 8
	* Shot speed: 1.5
	* Cost: 4
* IceTower:
	* Speed: 2
	* Range: 6
	* Damage per shot: 15
	* Shot speed: 3.5
	* Cost: 7
* LaserTower:  
	* Speed: 3
	* Range: 5
	* Damage per shot: 7
	* Shot speed: 10
	* Cost: 7
* GateToHell:
	* Speed: 1
	* Range: 2
	* Damager per shot: 300
	* Shot speed: 2
	* Cost: 25  	   	   


