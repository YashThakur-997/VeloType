import React from 'react'
import { useEffect, useState } from 'react';
import socket from '../socket';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const resultssection = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [gameData, setGameData] = useState(null);

    useEffect(() => {
        console.log("Fetching game data for room ID:", roomId);

        const handleGameStatus = (data) => {
            console.log("Received game data:", data);
            setGameData(data);
        };
        
        socket.on('gameStatus', handleGameStatus);
        socket.emit('getGameStatus', roomId);

        return () => {
            socket.off('gameStatus', handleGameStatus);
        };
    }, [roomId]);

    const handelback = ()=> {
        socket.emit('updateProgress',roomId,0);
        socket.emit('updateRank',roomId,socket.id,0);
        navigate('/room/'+roomId);
    }


    return (
        <>
            <div>
                This is the Results Section
            </div>
            <div className="result-section">
                <h2>Results for Room ID: {roomId}</h2>
                {gameData?.players
                    .sort((a, b) => a.rank - b.rank)
                    .map((player) => (
                        <div key={player.id}>
                            <p>
                                {player.name} - Rank: {player.rank !== null ? player.rank : "N/A"}
                            </p>
                        </div>
                    ))}
            </div>
            <div className="new-game">
                <button onClick={handelback} className='bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded'>Back to Room</button>
            </div>
        </>
    )
}

export default resultssection
