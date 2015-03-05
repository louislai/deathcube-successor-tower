__Library__  
This project improves upon the code base of the __Ultimate Tower Defense__ by __Florian Rappl__ at _http://www.codeproject.com/Articles/737238/Ultimate-Tower-Defense_. The __Ultimate Tower Defense__ project is available under the CPOL license.

__Directory Structure__  

* index.html : a file for testing the game with default AI programs
* test_ai.html : a file for testing the game with custom AI programs
* Content/ : Contain resource and static files
	* effects/ :  Contain sound effect mp3 files
	* icons/ : Contain icon files
	* musics/ : Contain game theme song
	* sprites/ : Contain sprite images
	* background.png : Background for the canvas
	* page.png : Background for the page
	* style.css : CSS stylesheet
* Scripts/ : Contain the main programs responsible for the game
	* jediscript-week-13.js : JediScript library. Included to allow for JediScript syntax in the AI classes.
	*  oop.js : Define the OOP class implementation in the game
	*  main.js : Define the main classes used by the game engines. Noteworthy classes: Path, Player, GameObject, Tower, Unit, Shot.
	*  logic: The main game logic, as well as the game loop is housed here. Included inside here is also the Wave class that handle the generation of soldiers during the wave phase
	*  path.js : Define the Maze class responsible for the main grid of the game map, as well as other classes responsible for maze-traversing inside the map.
	*  video.js : Responsible for the graphics and rendering of the game.
	*  sounds.js : Responsible for controlling sound inside the game.
	*  towers.js : Define the different Tower classes inside the game
	*  shots.js : Define the different Shot classes inside the game.
	*  units.js : Define the different Unit classes inside the game.
	*  ai.js : Define the AI APIs for the students.
	*  record.js : Define the Gamestate APIs for the student
	*  manifest: House the constants and resource routes used by the game
	*  utilities.js : Utility functions.

__Thoughts about the project progress__  
During the span of the project, I have modified the existing code base extensively so that it can support the type of multiplayer turn-based defense-and-attack game I was conceptualising. The UIs have also been updated to reflect the multiplayer game mode.  
Something that should be made clear is that the PlayerAI, AIUnit, AITowerToBuild, AITowerToDestroy classes that students need to subclass are not the actual classes that game engine actually use internally to run the game. The inner representations of player, unit and tower are actually done by the Player, Unit, and Tower classes. The AI classes give the engine the necessary data to instanize the appropriate inner objects.  
Regarding security, right now the students never actually got direct access to the objects in the engine. Even the MazeRecord only hold copies of the game objects and not the actual data. Also I use the Object.defineProperty to set all the constants in __manifest.js__ to unwritable. This however is not an optimal solution. Obfuscation may also be considered.  
Also, the game is quite laggy on Safari.


__Possible Future Improvements__  
It is possible to extend the number of units and towers for the game, as the design is OOP and is easily extensible. It is even possible to allow students the ability to design their own units/towers.  Also there might be a need to make the game more balanced.
The handler for competition running has not been implemented yet.  
It is possible to look into security improvements in greater details.