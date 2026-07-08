import { useEffect, useState } from "react"
import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react"
import "@livekit/components-styles"
import Chat from "./Chat"
import "./Room.css"

function Room({ roomId, username, onLeave }) {
  const [token, setToken] = useState(null)
  const [url, setUrl] = useState(null)
  const [error, setError] = useState(null)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(
          `https://videoconnect-production-05db.up.railway.app/token?room=${roomId}&username=${username}`
        )
        const data = await res.json()
        setToken(data.token)
        setUrl(data.url)
      } catch (err) {
        setError("Could not connect to server. Is it running?")
      }
    }

    fetchToken()
  }, [roomId, username])

  if (error) return (
    <div style={{ textAlign: "center", marginTop: "100px", color: "red" }}>
      {error}
    </div>
  )

  if (!token) return (
    <div style={{ textAlign: "center", marginTop: "100px", color: "white" }}>
      Connecting to room...
    </div>
  )

  return (
    <div style={{ height: "100vh", position: "relative" }}>

      {/* Chat toggle button */}
      <button
        onClick={() => setShowChat(!showChat)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: showChat ? "320px" : "30px",
          zIndex: 1001,
          background: "linear-gradient(135deg, #7c6ff7, #5b4fcf)",
          color: "white",
          border: "none",
          borderRadius: "50px",
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 5px 20px rgba(124, 111, 247, 0.4)",
          transition: "all 0.3s ease"
        }}
      >
        {showChat ? "✕ Close Chat" : "💬 Chat"}
      </button>

      {/* Room ID display */}
      <div style={{
        position: "fixed",
        top: "15px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1001,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
        color: "white",
        padding: "8px 20px",
        borderRadius: "50px",
        fontSize: "13px",
        border: "1px solid rgba(255,255,255,0.1)"
      }}>
        🔗 Room Code: <strong>{roomId}</strong>
      </div>

      <LiveKitRoom
        token={token}
        serverUrl={url}
        connect={true}
        video={true}
        audio={true}
        onDisconnected={onLeave}
      >
        <VideoConference />
      </LiveKitRoom>

      {showChat && (
        <Chat
          roomId={roomId}
          username={username}
          onClose={() => setShowChat(false)}
        />
      )}

    </div>
  )
}

export default Room
