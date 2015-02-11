#### Tower Defense/Attack Multiplayer Game ####

__Gameplay__: The game has two players, player 1 occupying the left base, player 2 occupying the right base. The game begins by loading up the AIs defined by the players. Then there will be multiple rounds. During each round one player send attackers while the other defend their base. After each round, the players switch their roles. Player 1 starts attacking first, while player 2 defends first.

##### TODOs: #####

* Decide what game state to be record
* Modify WaveGenerator so it decide the time a unit appears based on used algorithm. Also decide a constraint on no of units or lapse time of each round.
* Implement another winning condition (in the case where no players die)
* Find some ways to prevent the  students from overriding engine attributes
* Implement an 'act' method for PlayerAI so that game engine can just call .act() to execute what the AI needs to do
* Think of other possible towers/units. Or should we leave it to the user imagination to customise their tower/unit?