const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const path = require('path'); // Useful for directory paths
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('./models/db.connection'); // Ensure DB connection is established

// mongoose.connection.on('connected', () => {
//     console.log('MongoDB connection established successfully');
// });

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://velotype-2.onrender.com","http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});

app.use(express.json());

const authRouter = require("./routes/auth.route");

app.use("/auth", authRouter);

app.use(cors());
// Import room controller
const setupRoomController = require('./controllers/controller.rooms');
const setupGameController = require('./controllers/controller.game');


// 2. Serve static files (Crucial if you want to use your CSS/JS files)
app.use(express.static('public')); 


// Set up room controller first
setupRoomController(io);

// Then set up game controller (which adds game-specific handlers)
setupGameController(io);


server.listen(PORT);