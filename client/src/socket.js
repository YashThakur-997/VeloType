import { io } from "socket.io-client";

// This only runs once when the app starts
const socket = io("http://localhost:3000", {
  autoConnect: false,
});

export default socket;