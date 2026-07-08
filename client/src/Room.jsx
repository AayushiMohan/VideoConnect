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
    <div className="error-screen">
      {error}
    </div>
  )

  if (!token) return (
    <div className="loading-screen">
      Connecting to room...
    </div>
  )

  return (
    <div className="room-wrapper">

     <button
  className="chat-btn"
  onClick={() => setShowChat(!showChat)}
>
  {showChat ? "✕ Close Chat" : "💬 Chat"}
</button>
<div className="room-code">
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
