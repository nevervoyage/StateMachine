// State interface is used for future creations of custom states for custom classes that extends "StateMachine" class
export interface State {
    readonly name: string,
    readonly actions: { name: string, call: (machine: StateMachine) => void }[],
}

export class StateMachine {
    state: State;
    readonly states: State[];

    constructor() {
        // this is basic state and i dont have any idea for one simple action and i made it throw an error
        const noneState: State = {
            name: "None",
            actions: [
                { name: "MakeError", call: () => { throw Error("Errored by None state") } }
            ]
        };

        this.state = noneState;
        this.states = [this.state];
    }

    // pushes given state
    addState(state: State) {
        this.states.push(state);
    }

    // if state is found, delete it
    //  else you will see a warning about it
    removeState(name: string) {
        const foundIndex = this.states.findIndex((state) => state.name === name);
        if (foundIndex)
            this.states.splice(foundIndex, 1);
        else
            console.warn(`[StateMachine] ${name} state hasnt been found inside state machine to remove it`)
    }

    // "StateMachine" only swaps between already added states
    //  if state not found, you will see warning
    changeState(name: string) {
        const foundState = this.states.findIndex((state) => state.name === name);
        if (foundState)
            this.state = this.states[foundState];
        else
            console.warn(`[StateMachine] ${name} state hasnt been found inside state machine to swap to it`)
    }

    // "StateMachine" only calls actions inside current state
    //  if action not found, you will see warning
    triggerAction(name: string) {
        this.state.actions.forEach((action) => {
            if (action.name === name)
                action.call(this);
            else
                console.warn(`[StateMachine] ${name} action hasnt been found in ${this.state} state`)
        });
    }
}
