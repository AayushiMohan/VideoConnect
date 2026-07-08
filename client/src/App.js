import { useState } from "react"
import Room from "./Room"
import "./App.css"

function App() {
  const [screen, setScreen] = useState("home")
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")

  const createRoom = () => {
    if (!username.trim()) {
      alert("Please enter your name first!")
      return
    }
    const newRoom = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomId(newRoom)
    setScreen("room")
  }

  const joinRoom = () => {
    if (roomId.trim() && username.trim()) {
      setScreen("room")
    } else {
      alert("Please enter both name and room code!")
    }
  }

  if (screen === "room") {
    return (
      <Room
        roomId={roomId}
        username={username}
        onLeave={() => {
          setScreen("home")
          setRoomId("")
        }}
      />
    )
  }

  return (
    <div className="home-container">
      <div className="glass-card">

        <div className="logo">VC</div>
        <h1 className="title">VideoConnect</h1>
        <p className="subtitle">Connect, collaborate and communicate with secure HD video meetings</p>

        <div className="two-col">

          {/* LEFT — Create Room */}
          <div className="col">
            <div className="input-group">
              <label>Your Name</label>
              <input
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button className="btn-primary" onClick={createRoom}>
               Create New Room
            </button>
          </div>

          {/* CENTER DIVIDER */}
          <div className="or-divider">
            <div className="line"></div>
            <span className="or-text">OR</span>
            <div className="line"></div>
          </div>

          {/* RIGHT — Join Room */}
          <div className="col">
            <div className="input-group">
              <label>Room Code</label>
              <input
                placeholder="Enter room code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              />
            </div>
            <button className="btn-secondary" onClick={joinRoom}>
               Join Room
            </button>
          </div>

        </div>

       <div className="features">
       <div className="feature-item">HD Video</div>
       <div className="feature-item">Screen Share</div>
       <div className="feature-item">Real-time Chat</div>
       <div className="feature-item">50 Participants</div>
      </div>        

      </div>
    </div>
  )
}

export default App
