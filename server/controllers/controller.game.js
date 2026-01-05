const setupRoomController = require('./controller.rooms');
const games = setupRoomController.games;

module.exports = function setupGameController(io) {
    io.on('connection', (socket) => {
        // Inside io.on('connection')
        socket.on('start-game', (roomId) => {
            let countdown = 5;

            // Only start if the game exists and isn't already started
            if (games[roomId]) {
                const timer = setInterval(() => {
                    if (countdown > 0) {
                        io.to(roomId).emit('timer-update', countdown);
                        countdown--;
                    } else {
                        clearInterval(timer);
                        games[roomId].isStarted = true;
                        io.to(roomId).emit('start-typing');
                    }
                }, 1000);
            }
        });


        socket.on('updateProgress', (roomId, progress) => {
            if (games[roomId]) {
                const player = games[roomId].players.find(p => p.id === socket.id);
                if (player) {
                    player.progress = progress;
                    io.to(roomId).emit('gameStatus', games[roomId]);
                }
            }
        });
    });
};