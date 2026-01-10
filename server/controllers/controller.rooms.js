const games = {};

// Generate a random game ID
function generateGameId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Export the function to set up room controllers and the games object
module.exports = function setupRoomController(io) {
    io.on('connection', (socket) => {
        console.log('New player connected:', socket.id);

        // Create a new game
        socket.on('createGame', () => {
            const roomId = generateGameId();
            socket.join(roomId);

            games[roomId] = {
                id: roomId,
                players: [{ id: socket.id, name: 'Player 1', progress: 0, isHost: true ,rank: null}],
                isStarted: false,
                quote: "The quick brown fox jumps over the lazy dog." // You can fetch this from MongoDB
            };

            console.log(`Game created: ${roomId}`);
            socket.emit('gameCreated', games[roomId]);
            socket.emit('gameStatus', games[roomId]);
        });

        // Joining a game room
        socket.on('joinGame', (roomId, callback) => {
            if (games[roomId] && games[roomId].players.length < 4) {
                socket.join(roomId);

                // New player joining
                const playerNumber = games[roomId].players.length + 1;
                const newPlayer = { id: socket.id, name: `Player ${playerNumber}`, progress: 0, isHost: false, rank: null };
                games[roomId].players.push(newPlayer);
                console.log(`Player ${socket.id} joined game ${roomId}`);


                // Tell everyone in the room that the game state updated
                io.to(roomId).emit('gameStatus', games[roomId]);

                // Send success callback to the joining player
                if (callback) callback({ success: true });
            } else {
                // Send failure callback
                if (callback) callback({ success: false, message: 'Game not found' });
            }
        });

        // Handle request for game status
        socket.on('getGameStatus', (roomId) => {
            if (games[roomId]) {
                // Crucial: Re-join the room in case of a page refresh
                socket.join(roomId);

                // Send the specific game data back to the person who asked
                socket.emit('gameStatus', games[roomId]);
                console.log(`Sent status for room ${roomId} to ${socket.id}`);
            } else {
                socket.emit('error', { message: 'Game not found' });
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('Player disconnected:', socket.id);

            // Remove player from all games
            for (const roomId in games) {
                const game = games[roomId];
                const playerIndex = game.players.findIndex(p => p.id === socket.id);

                if (playerIndex !== -1) {
                    game.players.splice(playerIndex, 1);

                    // If no players left, delete the game
                    if (game.players.length === 0) {
                        delete games[roomId];
                        console.log(`Game ${roomId} deleted - no players left`);
                    } else {
                        // Notify remaining players
                        io.to(roomId).emit('gameStatus', games[roomId]);
                    }
                }
            }
        });
    });
};

// Export games object so other controllers can access it
module.exports.games = games;

