import React from 'react'
import {useEffect , useState} from 'react';
import socket from '../socket';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const roomsection = () => {

  const navigate = useNavigate();
  const [gameData, setGameData] = useState();
  const [countdown, setCountdown] = useState();
  const { roomId } = useParams();

  useEffect(() => {

    console.log("Fetching game status for room ID:", roomId);


    socket.on('gameStatus', (data) => {
      console.log("Received game status:", data);
      setGameData(data);
    });

    socket.on('timer-update', (countdown) => {
      console.log("Countdown:", countdown);
      setCountdown(countdown);
      if (countdown === 1) {
        navigate(`/game/${roomId}`);
      }
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
  <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 sm:p-12">
    {/* Room Header */}
    <div className="w-full max-w-2xl mb-8 flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-black text-slate-900 italic uppercase">Lobby</h1>
        <p className="text-slate-500 font-medium">Waiting for the race to begin...</p>
      </div>
      
      {gameData && (
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Room Code</span>
          <div className="flex items-center gap-2 bg-white p-2 px-4 rounded-lg border border-slate-200 shadow-sm mt-1">
            <code className="text-xl font-mono font-bold text-blue-600">{gameData.id}</code>
            <button 
              onClick={() => navigator.clipboard.writeText(gameData.id)}
              className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-blue-600"
              title="Copy ID"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Main Content Card */}
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
      
      {/* Player List Header */}
      <div className="bg-slate-900 p-4 px-8 flex justify-between items-center text-white">
        <h2 className="font-bold uppercase tracking-wider text-sm text-slate-400">Racers Joined</h2>
        <span className="bg-blue-600 text-xs font-black px-2 py-1 rounded-full">
          {gameData?.players.length || 0} / 8
        </span>
      </div>

      {/* Players */}
      <div className="p-4 px-8 divide-y divide-slate-50">
        {gameData?.players.map((player) => (
          <div key={player.id} className="py-4 flex justify-between items-center group">
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${player.id === socket.id ? 'bg-blue-500' : 'bg-slate-300'}`}>
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className={`font-bold ${player.id === socket.id ? 'text-blue-600' : 'text-slate-700'}`}>
                  {player.name} {player.id === socket.id && "(You)"}
                </p>
                {player.isHost && <span className="text-[10px] bg-amber-100 text-amber-700 font-black px-2 py-0.5 rounded uppercase tracking-tighter">👑 Host</span>}
              </div>
            </div>
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="p-8 bg-slate-50 border-t border-slate-100">
        {gameData?.players.find(p => p.id === socket.id)?.isHost ? (
          <div className="space-y-4 text-center">
            <button 
              onClick={handleStart} 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
              START THE RACE
            </button>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">You are the race director</p>
          </div>
        ) : (
          <div className="text-center py-4">
             <div className="inline-flex items-center gap-3 text-slate-500 font-bold italic animate-pulse">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                Waiting for host to start...
             </div>
          </div>
        )}
      </div>
    </div>

    {/* Secondary Actions */}
    <button 
      onClick={handleLeave} 
      className="mt-8 text-slate-400 hover:text-red-500 font-bold text-sm transition-colors uppercase tracking-widest"
    >
      ✖ Leave Room
    </button>

    {/* Countdown Overlay */}
    {countdown && (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900/95 z-50 backdrop-blur-sm">
        <p className="text-blue-500 font-black tracking-[0.5em] uppercase mb-4 animate-pulse">Prepare to Type</p>
        <h1 className="text-white text-[12rem] font-black italic animate-bounce leading-none">
          {countdown}
        </h1>
      </div>
    )}
  </div>
);
}

export default roomsection
