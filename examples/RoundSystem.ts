// this is bare-bones example of RoundSystem without comments
//  please read Player example to understand what each thing do

import { StateMachine, State } from "..\\src\\StateMachine";

class RoundSystem extends StateMachine {
    players: string[];
    afkPlayers: string[] = [];
    eleminatedPlayers: string[] = [];

    constructor(players: string[], name?: string) {
        super(name);
        this.players = players;
    }
}

const lobbyState: State = {
    name: "Lobby",
    actions: [
        {
            name: "enter",
            call: machine => {
                const roundSystem = machine as RoundSystem;
                console.log(`${roundSystem.players} has teleported to lobby`);
                roundSystem.players = roundSystem.players.concat(roundSystem.eleminatedPlayers);
                roundSystem.eleminatedPlayers = [];
            }
        },

        {
            name: "StartRound",
            call: machine => {
                const roundSystem = machine as RoundSystem;
                roundSystem.changeState("Round");
                console.log(`${roundSystem.players} started round`);
            }
        },

        {
            name: "MakePlayerAFK",
            call: (machine, playerName) => {
                const roundSystem = machine as RoundSystem;
                const player = roundSystem.players.findIndex(name => name === playerName);
                if (player) {
                    roundSystem.players.splice(player, 1);
                    roundSystem.afkPlayers.push(playerName);
                    console.log(`${playerName} entered afk`);
                }
            }
        },

        {
            name: "PlayerLeaveAFK",
            call: (machine, playerName) => {
                const roundSystem = machine as RoundSystem;
                const player = roundSystem.players.findIndex(name => name === playerName);
                if (player) {
                    roundSystem.afkPlayers.splice(player, 1);
                    roundSystem.players.push(playerName);
                    console.log(`${playerName} exited afk`);
                }
            }
        },

        {
            name: "exit",
            call: machine => {
                const roundSystem = machine as RoundSystem;
                console.log(`Round has been started!`);
            }
        }
    ]
};

const roundState: State = {
    name: "Round",
    actions: [
        {
            name: "EndRound",
            call: machine => {
                const roundSystem = machine as RoundSystem;
                roundSystem.changeState("Lobby");
                console.log(`${roundSystem.players} ended round`);
            }
        },

        {
            name: "EleminatePlayer",
            call: (machine, playerName) => {
                const roundSystem = machine as RoundSystem;
                const player = roundSystem.players.findIndex(name => name === playerName);
                if (player) {
                    roundSystem.players.splice(player, 1);
                    roundSystem.eleminatedPlayers.push(playerName);
                    console.log(`${playerName} has been eleminated!`);
                }
            }
        }
    ]
};

const roundSystem = new RoundSystem(["Alice", "Ben", "nevervoyage"], "RoundSystem");
roundSystem.addState(lobbyState);
roundSystem.addState(roundState);

roundSystem.changeState("Lobby");

roundSystem.triggerAction("MakePlayerAFK", "nevervoyage");
roundSystem.triggerAction("StartRound");

roundSystem.triggerAction("EleminatePlayer", "Ben");
roundSystem.triggerAction("EndRound");
