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
  <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
    {/* 1. Header with Trophy Icon */}
    <div className="text-center mb-10">
      <div className="inline-block p-4 bg-amber-100 rounded-full mb-4 shadow-sm">
        <span className="text-4xl">🏆</span>
      </div>
      <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">
        Final <span className="text-blue-600">Standings</span>
      </h1>
      <p className="text-slate-500 font-medium mt-2">Room ID: <span className="font-mono text-slate-800">{roomId}</span></p>
    </div>

    {/* 2. Results Card */}
    <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden mb-8">
      <div className="p-8">
        <div className="space-y-4">
          {gameData?.players
            .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
            .map((player, index) => {
              const isFirst = index === 0;
              return (
                <div 
                  key={player.id} 
                  className={`flex items-center justify-between p-5 rounded-2xl transition-all ${
                    isFirst 
                    ? 'bg-amber-50 border-2 border-amber-200 shadow-md scale-105' 
                    : 'bg-slate-50 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    {/* Rank Number/Badge */}
                    <div className={`h-10 w-10 flex items-center justify-center rounded-full font-black text-lg ${
                      isFirst ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    
                    {/* Player Name */}
                    <div>
                      <p className={`font-bold text-lg ${isFirst ? 'text-amber-900' : 'text-slate-700'}`}>
                        {player.name}
                      </p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {player.rank ? 'Finished' : 'DNF'}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Rank or WPM */}
                  <div className="text-right">
                    <span className={`text-sm font-black italic uppercase ${isFirst ? 'text-amber-600' : 'text-slate-400'}`}>
                      {isFirst ? '🥇 Winner' : `#${index + 1} Place`}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 3. Action Area */}
      <div className="p-8 bg-slate-900 border-t border-slate-800 flex flex-col items-center">
        <button 
          onClick={handelback} 
          className="group relative w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition-all transform hover:-translate-y-1 shadow-lg shadow-emerald-900/20"
        >
          <span className="flex items-center justify-center gap-2">
            Back to Room Lobby
          </span>
        </button>
        <p className="text-slate-500 text-[10px] mt-4 uppercase tracking-[0.2em] font-bold text-center">
          Ready for another round?
        </p>
      </div>
    </div>

    {/* Footer Link */}
    <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-600 font-bold text-sm uppercase tracking-widest transition-colors">
       ← Exit to Main Menu
    </button>
  </div>
);
}

export default resultssection
