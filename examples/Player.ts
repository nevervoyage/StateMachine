import { StateMachine, State } from "..\\src\\StateMachine";

// create "Player" class that extends StateMachine
class Player extends StateMachine {
    moveSpeed: number;

    constructor(name?: string) {
        super(name); // give a name to StateMachine for easier debbuging

        this.moveSpeed = 16;
    }
}

// make "Idle" state with action StartRunning that increases moveSpeed of player to 20 and changes its state to "Running"
const idleState: State = {
    name: "Idle",
    actions: [
        { 
            name: "StartRunning", 
            call: (machine, speedIncrease) => { // speedIncrease will be recived from machine.triggerAction(ACTION_NAME, OTHER_ARGS) as OTHER_ARGS
                const player = machine as Player; // this is neccesearry for TS
                player.changeState("Running")
                player.moveSpeed = 16 + speedIncrease;
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
            call: machine => {
                const player = machine as Player;
                player.changeState("Idle")
                player.moveSpeed = 16;
            } 
        },

        // when StateMachine changes state to "Running", first action will be always "enter" and will be triggered instantly
        {
            name: "enter",
            call: machine => {
                const player = machine as Player;
                console.log(`${player.name} started running`)
            }
        },

        // when StateMachine changes state from "Running", "exit" action will be triggered BEFORE changing state to new one
        //  this can be abused by adding something like machine.triggerAction() and it will fire "Running" action
        //  you can uncomment last line in call to see what happens
        {
            name: "exit",
            call: machine => {
                const player = machine as Player;
                console.log(`${player.name} stopped running`)

                // player.triggerAction("enter") // ExamplePlayer started running
            }
        }
    ]
}

// I recommend to save big states with seperate files and dont contain them in one single
// e.g. you can create full state for player with certain element moveset (for example fire)
//  and in this state you can create whole moveset in one file (all skills) and then import it in other file to add state to a "Player" class



// create player and insert created states
const player = new Player("ExamplePlayer"); // make this StateMachine have this.name = "ExamplePlayer". it useful for debbuging
player.addState(idleState);
player.addState(runningState);

// change state to Idle state to access "StartRunning" action
player.changeState("Idle");

player.triggerAction("StartRunning", 4); // addind 4 to moveSpeed
console.log(player.moveSpeed); // 20

player.triggerAction("StopRunning");
console.log(player.moveSpeed); // 16
