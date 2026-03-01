# VeloType 🏁

Live at : - https://velotype-2.onrender.com

A real-time multiplayer typing game where speed meets competition. Race against friends by typing text passages as fast and accurately as possible!

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🎮 About

VeloType is a competitive typing game that lets you challenge your friends in real-time typing races. Create a room, share the Room ID, and see who can type the fastest with the highest accuracy. Perfect for improving your typing skills while having fun!

## ✨ Features

- **🚀 Real-time Multiplayer Lobbies:** Create and join rooms via unique Room IDs
- **⏱️ Synchronized Game Starts:** Host-controlled game start with a 3-second countdown
- **📊 Live Race Tracking:** Watch other players' progress bars move as they type in real-time
- **✅ Smart Validation:** Intelligent character-matching logic to track typing accuracy
- **🎯 Competitive Racing:** See who can type the fastest with the best precision

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time WebSocket communication
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Socket.IO** - Real-time bidirectional event-based communication
- **MongoDB** (Mongoose) - NoSQL database for data persistence
- **CORS** - Cross-origin resource sharing
- **EJS** - Templating engine

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YashThakur-997/VeloType.git
   cd VeloType
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

5. **Start the development servers**

   **Terminal 1 - Start the backend:**
   ```bash
   cd server
   npm start
   ```

   **Terminal 2 - Start the frontend:**
   ```bash
   cd client
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🎯 How to Play

1. **Create or Join a Room**
   - Click "Create Room" to generate a unique Room ID
   - Share the Room ID with friends
   - Friends can join using "Join Room" and entering the ID

2. **Wait for Players**
   - Wait for all players to join the lobby
   - The host can see all connected players

3. **Start the Race**
   - Host clicks "Start Game"
   - 3-second countdown begins
   - Start typing when the countdown reaches zero!

4. **Type and Compete**
   - Type the displayed text as quickly and accurately as possible
   - Watch your progress bar and compare with other players
   - First to finish wins!

## 📁 Project Structure

```
VeloType/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── server/                # Backend Node.js application
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
│   ├── index.js          # Entry point
│   └── package.json
├── LICENSE
└── README.md
```

## 🤝 Contributing

Contributions are always welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the typing enthusiast community
- Inspired by classic typing race games
- Thanks to all contributors and testers

## 📧 Contact

**Yash Thakur** - [@YashThakur-997](https://github.com/YashThakur-997)

Project Link: [https://github.com/YashThakur-997/VeloType](https://github.com/YashThakur-997/VeloType)

---

⭐ Star this repository if you find it helpful!
