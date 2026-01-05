import React from 'react'
import {useEffect , useState} from 'react';
import socket from '../socket';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const roomsection = () => {

  const navigate = useNavigate();
  const [gameData, setGameData] = useState();
  const { roomId } = useParams();

  useEffect(() => {

    console.log("Fetching game status for room ID:", roomId);


    socket.on('gameStatus', (data) => {
      console.log("Received game status:", data);
      setGameData(data);
    });

    socket.on('timer-update', (countdown) => {
      console.log("Countdown:", countdown);
    });

    socket.on('start-typing', () => {
      console.log("Game started!");
      // Navigate to the typing game page or update state accordingly
    });

    // Request game details when component mounts
    socket.emit('getGameStatus', roomId);

    // Cleanup on unmount
    return () => {
      socket.off('gameStatus');
    };
  }, [roomId]);

  const handleLeave = () => {
    // Logic to leave the room and navigate back to main section
    socket.disconnect();
    navigate('/');
  };

  const handleStart = () => {
    // Logic to start the game
    socket.emit('start-game', roomId);
  };

  return (
    <>
  <div className="room-container">
    <h1>Game Lobby</h1>
    
    {/* Display the Room ID */}
    {gameData ? (
      <div className="room-info">
        <h3>Room ID: <span className="highlight">{gameData.id}</span></h3>
        <button onClick={() => navigator.clipboard.writeText(gameData.id)}>
          Copy ID
        </button>
      </div>
    ) : (
      <p>Loading game details...</p>
    )}

    {/* List the players */}
    <div className="player-list">
      {gameData?.players.map((player) => (
        <p key={player.id}>
          {player.name} {player.isHost ? "👑" : ""}
        </p>
      ))}
    </div>
  </div>
  {gameData?.players.find(player => player.id === socket.id)?.isHost && (<div className="start-game-container">
    <button onClick={handleStart} className="start-game-button bg-green-700 rounded-xl p-3">Start Game</button>
  </div>)}
  <div>
    <button onClick={handleLeave} className="leave-room-button bg-red-700 rounded-xl p-3 mt-5">Leave Room</button>
  </div>
  {gameData?.players.find(player => player.id === socket.id)?.isHost ? (
    <p>You are the host. Start the game when ready!</p>
  ) : (
    <p>waiting for host to start</p>
  )}
  </>
);
}

export default roomsection
