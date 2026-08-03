import { EventEmitter } from "./EventEmitter";

// Action interface used for easier creation of actions
export interface Action {
    readonly name: string,
    readonly call: (machine: StateMachine, ...args: any[]) => void;
}

// State interface is used for future creations of custom states for custom classes that extends "StateMachine" class
export interface State {
    readonly name: string,
    readonly actions: Action[],
}

export class StateMachine {
    state: State;
    readonly name: string;
    readonly stateEventEmitter = new EventEmitter();
    private _previousState: State;
    private _states: State[] = [];

    // this is basic state and i dont have any idea for one simple action and i made it throw an error
    private NONE_STATE: State = {
        name: "None",
        actions: [
            { name: "MakeError", call: () => { throw Error("Errored by None state") } }
        ]
    };

    constructor(name?: string) {
        this.name = name ?? "StateMachine" // make a name for StateMachine to track what StateMachines get failed

        this.state = this.NONE_STATE;
        this._previousState = this.state;

        // setup failed event to display all warns about bad usage of StateMachine
        //  this just helps to debug some conditional errors or something like that
        this.stateEventEmitter.on("failed", (trigger: string, ...args: any[]) => {
            console.warn(`! ${this.name} failed ${trigger}() by passing ${args} arguments`)
        })
    }

    // pushes given state
    addState(state: State) {
        if (this._states.some(foundState => state.name === foundState.name)) {
            this.stateEventEmitter.emit("failed", "addState", state.name); // emits event with state name
            return;
        }

        this._states.push(state);
        this.stateEventEmitter.emit("addState", state);
    }

    // if state is found, delete it
    //  else you will see a warning about it
    removeState(name: string) {
        const foundIndex = this._states.findIndex(state => state.name === name);
        if (foundIndex !== -1) {
            this._states.splice(foundIndex, 1);
            this.stateEventEmitter.emit("removeState", name); // emits event with state name
        }
        else
            this.stateEventEmitter.emit("failed", "removeState", name);
    }

    // "StateMachine" only swaps between already added states
    //  if state not found, you will see warning
    changeState(name: string) {
        const foundState = this._states.findIndex(state => state.name === name);
        if (foundState !== -1) {
            this.triggerAction("exit") // trigger "exit" action of old state if its exists
            this._previousState = this.state;
            this.state = this._states[foundState];
            this.triggerAction("enter") // trigger "enter" action of new state if its exists
            this.stateEventEmitter.emit("changeState", this.state, this._previousState); // emits event with current and previous state arguments
        }
        else 
            this.stateEventEmitter.emit("failed", "changeState", name);
    }

    // "StateMachine" only calls actions inside current state
    //  if action not found, you will see warning
    triggerAction(name: string, ...args: any[]) {
        let triggered = false;
        for (const action of this.state.actions) 
            if (action.name === name) {
                action.call(this, ...args);
                this.stateEventEmitter.emit("triggerAction", name); // emits event with action name
                triggered = true;
                break;
            }
        
        if (name !== "enter" && name !== "exit") // if action name was "enter" or "exit", DO NOT show warning
            if (!triggered)
                this.stateEventEmitter.emit("failed", "triggerAction", [name, args]);
    }

    // these both down is self explanatory
    getStates() {
        return [...this._states];
    }

    getPreviousState() {
        return this._previousState;
    }
}
