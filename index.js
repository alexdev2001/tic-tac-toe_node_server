// import dependancies & attatch to variables
const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const app = express();

// create server
const server = http.createServer(app);

// attatch web socket to server and make cors configuration
const io = socketIO(server, {
    cors : {
        origin: 'http://localhost:3001', // react url 
        methods: ["GET", "POST"]
    }
});

// craete a game object containing game board and current player properties
let game = {
    board: Array(9).fill(null),
    currentPlayer: "X"
};

// define the port
const port = 3009;

// add cors middleware to app 
app.use(cors());

// route for game
app.get('/game', (req, res) => {
    res.send(200).json('Now running tic tac toe game server');
});

// set up listeners for the server
io.on('connection', (socket) => {
    // log after connection has been made
    console.log('A user has been connected');

    // set up listeners for making a move emitting passed data after satisfied
    socket.on('makeMove', (data) => {
        io.emit('moveMade', data);
        console.log('a move was made');
    });

    // set up listeners for reseting a game emitting passed data after satisfied
    socket.on('resetGame', (newGame) => {
        io.emit('gameRest', newGame);
        console.log('the game was reset');
    });

    // set up a listener for the disconnection
    socket.on('disconnect', () => {
        console.log('A user has been disconnected');
    })
    
});

// server is listening
server.listen(port, () => {
    console.log(`The server is listening on port: ${port}`);
})