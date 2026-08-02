import { StateMachine, State } from "../src/StateMachine";

// create "Player" class that extends StateMachine
class Player extends StateMachine {
    moveSpeed: number;

    constructor() {
        super();

        this.moveSpeed = 16;
    }
}

// make "Idle" state with action StartRunning that increases moveSpeed of player to 20 and changes its state to "Running"
const idleState: State = {
    name: "Idle",
    actions: [
        { 
            name: "StartRunning", 
            call: (machine) => {
                const player = machine as Player; // this is neccesearry for TS
                player.changeState("Running")
                player.moveSpeed = 20;
            } 
        }
    ]
}

// make "Running" state with action StopRunning that increases moveSpeed of player to 16 and changes its state back to "Idle"
const runningState: State = {
    name: "Running",
    actions: [
        { 
            name: "StopRunning", 
            call: (machine) => {
                const player = machine as Player; // this is neccesearry for TS
                player.changeState("Idle")
                player.moveSpeed = 16;
            } 
        }
    ]
}

// I recommend to save big states with seperate files and dont contain them in one single
// e.g. you can create full state for player with certain element moveset (for example fire)
//  and in this state you can create whole moveset in one file (all skills) and then import it in other file to add state to a "Player" class



// create player and insert created states
const player = new Player();
player.addState(idleState);
player.addState(runningState);

// change state to Idle state to access "StartRunning" action
player.changeState("Idle");

player.triggerAction("StartRunning");
console.log(player.moveSpeed); // 20

player.triggerAction("StopRunning");
console.log(player.moveSpeed); // 16
