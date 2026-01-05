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
    <>
      <div>
        <p className='flex justify-center bold font-bold text-5xl mt-10'>VeloType</p>
      </div>
      <div className='flex justify-center mt-20'>

          <button onClick={creategame} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Host a Room
          </button>
  

          <form onSubmit={joingame} className='ml-10'>
            <input onChange={(e)=>setRoomId(e.target.value)} type="text" placeholder='Enter Room ID' className='border border-gray-300 rounded-md py-2 px-4 ml-4'/>
            <button type="submit" className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4'>
              Join a Room
            </button>
          </form>
        
      </div>
    </>
  )
}

export default mainsection
