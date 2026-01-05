const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const path = require('path'); // Useful for directory paths
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
// Import room controller
const setupRoomController = require('./controllers/controller.rooms');
const setupGameController = require('./controllers/controller.game');



app.use(express.json());

// 2. Serve static files (Crucial if you want to use your CSS/JS files)
app.use(express.static('public')); 


// Set up room controller first
setupRoomController(io);

// Then set up game controller (which adds game-specific handlers)
setupGameController(io);


server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});