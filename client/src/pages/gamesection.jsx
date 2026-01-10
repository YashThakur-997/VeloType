import { useEffect, useState } from 'react';
import socket from '../socket';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const gamesection = () => {
    const navigate = useNavigate();
    const [gameData, setGameData] = useState();
    const [userInput, setUserInput] = useState("");
    const [isActive, setIsActive] = useState(true);
    const { roomId } = useParams();

    useEffect(() => {
        console.log("Fetching game data for room ID:", roomId);

        const handleGameStatus = (data) => {
            console.log("Received game data:", data);
            setGameData(data);
            
            // Check if all players finished and navigate to results
            if (data.players.length > 0) {
                const allFinished = data.players.every(p => p.progress === 100);
                if (allFinished) {
                    console.log("All players finished! Navigating to results...");
                    navigate(`/results/${roomId}`);
                }
            }
        };

        socket.on('gameStatus', handleGameStatus);
        socket.emit('getGameStatus', roomId);

        return () => {
            socket.off('gameStatus', handleGameStatus);
        };
    }, [roomId, navigate]);

    const handleTyping = (e) => {
        const value = e.target.value;
        setUserInput(value);

        const quote = gameData?.quote;

        let correctChars = 0;

        for (let i = 0; i < quote.length; i++) {
            if (value[i] == quote[i]) {
                correctChars++;
            }
            else {
                break;
            }
        }

        const progress = (correctChars / quote.length) * 100;

        socket.emit('updateProgress', roomId, progress);

        if (value === quote) {
            setIsActive(false);
            
            // Calculate rank based on current gameData
            const totalplayers = gameData.players.length;
            let finishedPlayers = 0;
            
            for (let i = 0; i < totalplayers; i++) {
                if (gameData.players[i].progress === 100) {
                    finishedPlayers++;
                }
            }
            
            // This player just finished, so increment
            const playerRank = finishedPlayers + 1;
            socket.emit('updateRank', roomId, socket.id, playerRank);
            
            console.log(`You finished! Your rank is ${playerRank} out of ${totalplayers}`);

            if(finishedPlayers + 1 === totalplayers){
                console.log("All players finished! Navigating to results...");
                navigate(`/results/${roomId}`);
            }
        }

    };

    return (
        <>
            <div className="game-container">
                <h1>Typing Game</h1>
                {/* Typing game implementation goes here */}
                {/* The Quote Display */}
                <div className="quote-box p-5 bg-gray-100 rounded-lg mb-5 select-none">
                    <p className="text-xl tracking-wide">{gameData?.quote}</p>
                </div>
                {/* The Typing Area */}
                <textarea
                    value={userInput}
                    onChange={handleTyping}
                    disabled={!isActive}
                    className={`w-full h-32 p-4 text-lg border-2 rounded-xl focus:outline-none transition-all 
                ${isActive ? 'border-blue-500 bg-white' : 'border-gray-300 bg-gray-100 cursor-not-allowed'}`}
                />
            </div>
            {/* Progress Bars for all players */}
            <div className="mt-10 space-y-6">
                {gameData?.players.map((player) => (
                    <div key={player.id} className="w-full">
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold text-gray-600">
                                {player.name} {player.id === socket.id ? "(You)" : ""}
                            </span>
                            <span className="text-blue-600 font-bold">{Math.round(player.progress || 0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-500 h-full transition-all duration-300"
                                style={{ width: `${player.progress || 0}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default gamesection
