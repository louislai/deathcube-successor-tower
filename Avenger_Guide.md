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

__Project Status__  
During the span of the project, I have modified the existing code base extensively so that it can support the type of multiplayer turn-based defense-and-attack game I was conceptualising. The UIs have also been updated to reflect the multiplayer game mode.  
Something that should be made clear is that though the students will be subclassing the PlayerAI, AIUnit, AITowerToBuild, AITowerToDestroy classes, the inner representations of player, unit and tower are actually done by the Player, Unit, and Tower classes. The AI classes give the engine the necessary data to instantiate the appropriate Player/Unit/Tower objects.  

Although the game description describe the left-hand side as Player 1, and right-hand side as Player 2, their inner representations in the engine is more along the line of Player 0 and Player 1 respectively. In fact the __side attribute of the PlayerAI object and side attribute of Player object is indexed from 0.

Regarding security, the students never actually have direct access to the objects in the engine. Game data is made available to the student programs either by cloning them or by converting them to AI objects. Also I use the Object.defineProperty to set all the constants in __manifest.js__ to unwritable. This however might not be the best practice. (Actually towards the end of the project, I discovered about TypeScript which might be more appropriate for setting the visibility of private variables. But I did not have the time to implement it.) Obfuscation may also be considered.  

Also, the game is quite laggy on Safari.


__Possible Future Improvements__  

It is possible to extend the number of units and towers for the game, as the design is OOP and is easily extensible. It is even possible to allow students the ability to design their own units/towers.  Also there might be a need to make the game more balanced.   

The program to run the contest itself has not been implemented yet. 

Future maintainers can research methods to embed the game into JFDI Academy also. Though I believe the same method for old deathcube can be used. Student programs can be interpreted first and then run in the native browser by the engine. Then the game can be display in a 'Display' tab)
 
It is possible to look into security improvements in greater details.

Future maintainers of the project can also look into alternative methods to manipulate the game speed without breaking the game semantics. The current method works but can make the game appear laggy on some browser.

Future maintainers of the project can also look into alternative ways to control maze-traversing behaviours of units.

The sprites, icons and background can be redesigned as well. The current map background and page background are actually obtained through Google Images search and should be replaced to avoid copyright issues.

Develop automated tests

Optimise code efficiency further (e.g. with asm.js)