import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';



const mainsection = () => {
  const [roomId,setRoomId]=useState("");
  const navigate=useNavigate();
  
  useEffect(() => {
    // Connect socket when component mounts
    if (!socket.connected) {
      socket.connect();
    }

    // Setup event listeners for game creation (host only)
    const handleGameCreated = (gameStatus) => {
      console.log("Game Created with ID:",gameStatus.id);
      navigate(`/room/${gameStatus.id}`);
    };

    socket.on("gameCreated", handleGameCreated);

    // Cleanup function
    return () => {
      socket.off("gameCreated", handleGameCreated);
    };
  }, [navigate]);

  const creategame=()=>{
    socket.emit("createGame");
  }

  const joingame= (e) => {
    e.preventDefault();
    socket.emit("joinGame", roomId, (response) => {
      console.log("Join game response:", response);
      if (response && response.success) {
        navigate(`/room/${roomId}`);
      } else {
        alert("Room is full or doesn't exist!");
      }
    });
  };

  return (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
    {/* Header Section */}
    <div className="mb-12 text-center">
      <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic uppercase">
        Velo<span className="text-blue-600">Type</span>
      </h1>
      <p className="text-slate-500 mt-2 font-medium">The ultimate multiplayer typing race</p>
    </div>

    {/* Main Card */}
    <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg border border-slate-100">
      
      {/* Host Section */}
      <div className="mb-10 text-center">
        <button 
          onClick={creategame} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-200"
        >
          Host a Private Room
        </button>
      </div>

      {/* Divider */}
      <div className="relative mb-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-slate-400 uppercase tracking-widest font-bold text-xs">OR</span>
        </div>
      </div>

      {/* Join Section */}
      <form onSubmit={joingame} className="space-y-4">
        <div className="relative">
          <input 
            onChange={(e) => setRoomId(e.target.value)} 
            type="text" 
            placeholder="Enter Room ID (e.g. 8A2B)" 
            className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-4 px-5 outline-none focus:border-blue-500 focus:bg-white transition-all text-center text-lg font-mono tracking-widest"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-100"
        >
          Enter Race
        </button>
      </form>
    </div>

    {/* Footer Info */}
    <p className="mt-8 text-slate-400 text-sm italic">
      Join over 1,000+ racers worldwide
    </p>
  </div>
);
}

export default mainsection
