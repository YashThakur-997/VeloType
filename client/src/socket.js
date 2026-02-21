import { io } from "socket.io-client";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

// This only runs once when the app starts
const socket = io(PORT, {
  autoConnect: false,
});

export default socket;