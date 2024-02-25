
const CorsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
const Cors = require("cors")(CorsOptions);
// const Express = require("express")().use(Cors);
// const Http = require("http").Server(Express);
// const Socketio = require("socket.io")(Http, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"]
//     }
//   });
const events = require('events');
const express = require("express");
const SocketIO = require("socket.io");

// const path = require('path');
// const app = Express;

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const server = express()
//   .static(path.resolve(__dirname, 'frontend', 'static'),
//     {extensions: ["js"]})
  .use(Cors)
//   test
  .use(express.static(__dirname + '/dist/docs/'))
//   .use((req, res) => {console.log(req); res.sendFile(INDEX, { root:`${ __dirname}/dist/docs` });})
  .listen(PORT, () => console.log(`Listening on ${PORT}`, __dirname));

const Socketio = SocketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

// app.use(Express.static(__dirname + '/dist/docs'));
// app.get('/*', function(req,res) {
//     res.sendFile(path.join(__dirname+'/dist/docs/index.html'));
// });

// app.listen(process.env.PORT || 8080);

// Http.listen(3000, () => {
//     console.log("listening on 3000");
// });

// Http.listen(process.env.PORT || 8080, () => {
//     console.log("listening");
// });

var games = [];

var eventChannel = new events.EventEmitter();
eventChannel.on('empty', (id) => {
    console.log('got the empty event id', id);
    games = games.filter((gameRecord) => 
        gameRecord.id != id || gameRecord.game.player1 || gameRecord.game.player2
    );
    Socketio.emit("gamesList", getGamesList());
})


// use uuids?
// use a map of used ids to prevent collision?
var id = 0;

function handleConnection(socket) {
    console.log('connection');
    socket.emit("gamesList", getGamesList());

    socket.on("createGame", _data => {
        let newId = id++
        let game = new Game(socket, eventChannel, newId);
        games.push({game: game, id: newId});
        console.log('createGame newId', newId);
        socket.emit("newGame", {id: newId});
        Socketio.emit("gamesList", getGamesList());
        // console.log('created Game', game, games);
    });

    socket.on("joinGame", data => {
        let game = games.find(game => game.id == data.id);
        console.log('joinGame data', data);
        console.log('about to addConnection to ', game);
        game?.game?.addConnection(socket, data);
        // Socketio.emit("gamesList", games);
    });

    // let game = new Game(socket);
}

function getGamesList() {
    console.log('get games list', games.map((game) => {return {id: game.id, player1Name: game.player1Name, player2Name: game.player2Name}}))
    return games.map((game) => {return {id: game.id, player1Name: game.game?.player1Name, player2Name: game.game?.player2Name}});
}

Socketio.on("connection", handleConnection);

// we need to pass the socket connection from the lobby component to the game
class Game {
    id;
    moves = [];

    player1;
    player2;
    player1Name;
    player2Name;
    spectators = [];
    numSpectators = 0;

    mostRecentData;
    messages = [];

    eventChannel;

    constructor(socket, eventChannel, id) {
        console.log('game constructor');
        // this.addConnection(socket);
        this.eventChannel = eventChannel;
        this.id = id;
    }

    emitToConnections(message, data) {
        if (this.player1) {
            this.player1.emit(message, data);
        }

        if (this.player2) {
            this.player2.emit(message, data);
        }

        for (let spectator of this.spectators) {
            if (spectator) {
                spectator.emit(message, data);
            }
        }
    }

    addConnection(socket, data) {
        let socketStatus;
        socket.emit("messages", {
            messages: this.messages
        });
        // console.log('addConnection', this.player1, this.player2);
        console.log('add connection');

        if (!this.player1) {
            this.player1 = socket;
            if (data.name) {
                this.player1Name = data.name;
            }
            socketStatus = 'player1';
            console.log('player 1 connected');

            socket.emit("setPlayerStatus", {
                color: 1,
                isSpectator: false,
                spectatorNumber: -1,
            });
            socket.emit("moveUpdate", this.mostRecentData);
        } else if (!this.player2) {
            socketStatus = 'player2';
            console.log('player 2 connected');        

            this.player2 = socket;
            if (data.name) {
                this.player2Name = data.name;
            }
            socket.emit("setPlayerStatus", {
                color: 0,
                isSpectator: false,
                spectatorNumber: -1,
            });
            socket.emit("moveUpdate", this.mostRecentData);
        } else {
            this.spectators.push(socket);
            socketStatus = 'spectator';
            this.numSpectators++;
            console.log('spectator connected');

            socket.emit("setPlayerStatus", {
                color: Math.floor(Math.random()),
                isSpectator: true,
                spectatorNumber: this.numSpectators,
            });
            socket.emit("moveUpdate", this.mostRecentData);
        }

        socket.on("undo", data => {
            // pop from moves array
            console.log('undo');
            if (!this.moves.length) return;
            this.moves.pop();
            let previousMove = this.moves[this.moves.length - 1];
            console.log('previousMove', previousMove)
            if (!previousMove) {
                // Socketio.emit("refresh", {});
                return;
            } 
            this.mostRecentData = previousMove;
            // Socketio.emit("moveUpdate", previousMove);
            this.emitToConnections("moveUpdate", previousMove);
        });

        socket.on("move", data => {
            console.log('move by', socketStatus);
            this.mostRecentData = data;
            
            // Socketio.emit("moveUpdate", data);
            this.emitToConnections("moveUpdate", data);
            this.moves.push(data);
        });

        socket.on("message", data => {
            console.log("message", data);
            this.messages.push(data);
            // Socketio.emit("messages", {
            //     messages: messages
            // });
            this.emitToConnections("messages", {messages: this.messages});
        });

        socket.on("refresh", data => {
            // Socketio.emit("refresh", {});
            this.emitToConnections("refresh", {});
        });

        socket.on('exit', _ => {
            // console.log(socket);
            if (socket == this.player1 || socketStatus == 'player1') {
                console.log('player 1 disconnected');
                this.player1 = null;
            } else if (socket == this.player2 || socketStatus == 'player2') {
                console.log('player 2 disconnected');
                this.player2 = null;
            } else {
                console.log('spectator disconnected');
                this.numSpectators--;
            }

            if (!this.player1 && !this.player2) {
                console.log('about to emit empty');
                setTimeout(() => {
                    if (!this.player1 && !this.player2) {
                        console.log('emitting empty')
                        this.eventChannel.emit('empty', this.id)
                    }
                }, 30000)
            }
        });

        socket.on("disconnect", _ => {
            // console.log(socket);
            if (socket == this.player1 || socketStatus == 'player1') {
                console.log('player 1 disconnected');
                this.player1 = null;
            } else if (socket == this.player2 || socketStatus == 'player2') {
                console.log('player 2 disconnected');
                this.player2 = null;
            } else {
                console.log('spectator disconnected');
                this.numSpectators--;
            }

            if (!this.player1 && !this.player2) {
                console.log('about to emit empty');
                setTimeout(() => {
                    if (!this.player1 && !this.player2) {
                        console.log('emitting empty')
                        this.eventChannel.emit('empty', this.id)
                    }
                }, 30000)
            }
        });
    }


}


/**
     * we will push to an array of connections.
     * we need to store player1, player2, spectators, numSpectators, moves, and messages for each game.
     */

/** 
let socketStatus;

socket.emit("messages", {
    messages: messages
});

if (!player1) {
    player1 = socket;
    socketStatus = 'player1';
    console.log('player 1 connected');

    socket.emit("setPlayerStatus", {
        color: 1,
        isSpectator: false,
        spectatorNumber: -1,
    });
    socket.emit("moveUpdate", mostRecentData);
} else if (!player2) {
    socketStatus = 'player2';
    console.log('player 2 connected');        

    player2 = socket;
    socket.emit("setPlayerStatus", {
        color: 0,
        isSpectator: false,
        spectatorNumber: -1,
    });
    socket.emit("moveUpdate", mostRecentData);
} else {
    spectators.push(socket);
    socketStatus = 'spectator';
    numSpectators++;
    console.log('spectator connected');

    socket.emit("setPlayerStatus", {
        color: Math.floor(Math.random()),
        isSpectator: true,
        spectatorNumber: numSpectators,
    });
    socket.emit("moveUpdate", mostRecentData);
}

socket.on("undo", data => {
    // pop from moves array
    console.log('undo');
    if (!moves.length) return;
    moves.pop();
    let previousMove = moves[moves.length - 1];
    console.log('previousMove', previousMove)
    if (!previousMove) {
        Socketio.emit("refresh", {});
        return;
    } 
    mostRecentData = previousMove;
    Socketio.emit("moveUpdate", previousMove);
});

socket.on("move", data => {
    console.log('move by', socketStatus);
    mostRecentData = data;
    
    Socketio.emit("moveUpdate", data);
    moves.push(data);
});

socket.on("message", data => {
    console.log("message", data);
    messages.push(data);
    Socketio.emit("messages", {
        messages: messages
    });
});

socket.on("refresh", data => {
    Socketio.emit("refresh", {});
});

socket.on("disconnect", _ => {
    // console.log(socket);
    if (socket == player1 || socketStatus == 'player1') {
        console.log('player 1 disconnected');
        player1 = null;
    } else if (socket == player2 || socketStatus == 'player2') {
        console.log('player 2 disconnected');
        player2 = null;
    } else {
        console.log('spectator disconnected');
        numSpectators--;
    }

    if (player1 === null && player2 === null) {
        mostRecentData = null;
        games = [];
    }
});
*/

/**
 * Implement move histroy, with functionality for storing the history of move objects,
 * which contain properties for the gameboard state.
 * Listen for undo socket events, pop from moveHistory, and send that move as a moveUpdate to the client.
 */

/**
 *  Changes to package.json:
 *  
 */
 