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
  <div className="min-h-screen bg-slate-50 p-4 sm:p-8 flex flex-col items-center">
    
    {/* 1. Header & Room Info */}
    <div className="w-full max-w-4xl flex justify-between items-center mb-8">
      <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">
        Velo<span className="text-blue-600">Race</span>
      </h1>
      <div className="bg-white px-4 py-1 rounded-full border border-slate-200 text-sm font-bold text-slate-500 shadow-sm">
        Room: {roomId}
      </div>
    </div>

    <div className="w-full max-w-4xl grid grid-cols-1 gap-8">
      
      {/* 2. The Race Track (Progress Bars) */}
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Live Track
        </h2>
        
        <div className="space-y-6">
          {gameData?.players.map((player) => (
            <div key={player.id} className="relative">
              <div className="flex justify-between items-end mb-1">
                <span className={`text-sm font-bold ${player.id === socket.id ? 'text-blue-600' : 'text-slate-600'}`}>
                  {player.name} {player.id === socket.id && " (You)"}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {Math.round(player.progress || 0)}%
                </span>
              </div>
              
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-50">
                <div
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    player.id === socket.id ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-slate-400'
                  }`}
                  style={{ width: `${player.progress || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. The Typing Arena */}
      <div className="bg-slate-900 p-8 rounded-4xl shadow-2xl">
        {/* Quote Display */}
        <div className="relative mb-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 select-none">
          <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed font-medium tracking-wide">
            {/* You could eventually map through characters here to highlight errors in red */}
            {gameData?.quote}
          </p>
          <div className="absolute -top-3 left-6 bg-blue-600 text-[10px] font-black px-2 py-0.5 rounded text-white uppercase tracking-widest">
            Target Text
          </div>
        </div>

        {/* Typing Input */}
        <div className="relative">
          <textarea
            value={userInput}
            onChange={handleTyping}
            disabled={!isActive}
            spellCheck="false"
            autoFocus
            className={`w-full h-32 p-5 text-xl font-mono rounded-2xl outline-none transition-all resize-none border-2
              ${isActive 
                ? 'bg-white border-blue-500 text-slate-900 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'}`}
            placeholder={isActive ? "Type the quote exactly as shown..." : "Waiting for green light..."}
          />
          
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700 text-slate-400 font-bold uppercase text-sm tracking-widest">
                Locked
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-widest">
          <span>Accuracy: 100%</span>
          <span>Time: 00:00</span>
        </div>
      </div>

    </div>
  </div>
);
}

export default gamesection
