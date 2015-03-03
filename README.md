#### Tower Defense/Attack Multiplayer Game ####

__Gameplay__: The game has two players, player 1 occupying the left base, player 2 occupying the right base. The game begins by loading up the AIs defined by the players. Then there will be multiple rounds. Each round consists of 2 phases: building phase and waving phase. The building phase occurs first, during which the players will build whatever they want to build. They can destroy their existing building to get back spaces or money during this phase too. Next, during the waving phase, player 1 and 2 take turns to attack each other. The game continues until until someone dies or if the maximum number of rounds is reached.

##### TODOs: #####
* Research strategies to run the game in JFDI environment (done)
* Re-balance the game by updating tower's cost, unit's cost, unit's prize (Xiaodong)
* Re-implement ai generator so it can accept Jediscript list-style inputs (done)
* Decide what game state to be record (done)
* Modify WaveGenerator so it decide the time a unit appears based on used algorithm. Also decide a constraint on no of units or lapse time of each round. (Done)
* Implement another winning condition (in the case where no players die) (Done)
* Find some ways to prevent the  students from overriding engine attributes (Partially)
* Implement an 'act' method for PlayerAI so that game engine can just call .act() to execute what the AI needs to do (May not be necessary)
* Think of other possible towers/units. Or should we leave it to the user imagination to customise their tower/unit? (Xiaodong)