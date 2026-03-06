import { io } from "socket.io-client";

const PORT = import.meta.env.VITE_PORT || "http://localhost:3000"; // Use env variable or default to localhost

// This only runs once when the app starts
const socket = io(PORT, {
  autoConnect: false,
});

export default socket;