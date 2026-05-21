# 🎥 VideoConnect

<div align="center">

![VideoConnect Banner](https://img.shields.io/badge/VideoConnect-Live%20Video%20Conferencing-7c6ff7?style=for-the-badge&logo=webrtc)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-video--connect--beryl.vercel.app-7c6ff7?style=for-the-badge)](https://video-connect-beryl.vercel.app)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)
[![LiveKit](https://img.shields.io/badge/LiveKit-WebRTC-blue?style=for-the-badge)](https://livekit.io/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://video-connect-beryl.vercel.app)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)

**A scalable real-time video conferencing platform supporting 40–50 concurrent users**

🌐 **Live App:** [video-connect-beryl.vercel.app](https://video-connect-beryl.vercel.app)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure)

</div>

---

## Features

-  **HD Video Calling** — Real-time video conferencing with up to 50 users
-  **Audio/Video Toggle** — Mute/unmute mic and turn camera on/off
-  **Screen Sharing** — Share your screen with all participants
-  **Group Chat** — Real-time chat sidebar with Socket.io
-  **Shareable Room Codes** — Create rooms with unique codes and share instantly
-  **SFU Architecture** — Uses LiveKit SFU for scalable media routing (no P2P bottleneck)
-  **Secure** — JWT-based token authentication for room access
-  **Responsive** — Works on desktop and mobile browsers

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, LiveKit Components, CSS3 |
| **Backend** | Node.js, Express.js |
| **Real-time Communication** | WebRTC, LiveKit SFU |
| **Chat** | Socket.io |
| **Authentication** | LiveKit JWT Tokens |
| **Frontend Deployment** | Vercel |
| **Backend Deployment** | Railway |

---

## Getting Started

### Prerequisites
- Node.js v18+
- A free [LiveKit Cloud](https://livekit.io) account

### 1. Clone the repository
```bash
git clone https://github.com/AayushiMohan/VideoConnect.git
cd VideoConnect
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
LIVEKIT_URL=wss://your-project.livekit.cloud
PORT=5000
```

Start the server:
```bash
node index.js
```

### 3. Setup Frontend
```bash
cd client
npm install
npm start
```

### 4. Open the app
Visit `http://localhost:3000` in your browser 🎉

---

## Project Structure

```
VideoConnect/
├── client/                   # React Frontend
│   └── src/
│       ├── App.js            # Home page — create/join room
│       ├── Room.jsx          # Video call screen
│       ├── Chat.jsx          # Real-time chat sidebar
│       └── App.css           # Styling
│
└── server/                   # Node.js Backend
    ├── index.js              # Express + Socket.io + LiveKit token API
    └── package.json
```

---

## How It Works

```
User creates/joins room
        ↓
Backend generates LiveKit JWT token
        ↓
Frontend connects to LiveKit SFU
        ↓
SFU routes media streams to all participants
        ↓
Socket.io handles real-time chat messages
        ↓
Everyone sees and chats with everyone ✅
```

---

## Upcoming Features

- [x] ✅ Deploy on Vercel + Railway
- [ ] Participant list panel
- [ ] Raise hand feature
- [ ] Meeting recording
- [ ] Breakout rooms
- [ ] AI meeting summary using Claude API

---

<div align="center">
  Built by <a href="https://linkedin.com/in/aayushimohan/">Aayushi Mohan</a> — Free to use, open source 🚀
</div>
