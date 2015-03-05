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

__Thoughts about the project__


__Possible Future Improvements__
