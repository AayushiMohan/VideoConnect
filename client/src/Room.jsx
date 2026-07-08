import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import Chat from "./Chat";
import "./Room.css";

function Room({ roomId, username, onLeave }) {
  const [token, setToken] = useState(null);
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room code copied!");
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(
          `https://videoconnect-production-05db.up.railway.app/token?room=${roomId}&username=${username}`
        );

        const data = await res.json();

        setToken(data.token);
        setUrl(data.url);
      } catch (err) {
        setError("Could not connect to server.");
      }
    };

    fetchToken();
  }, [roomId, username]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;

    return [h, m, s]
      .map((v) => String(v).padStart(2, "0"))
      .join(":");
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!token) {
    return (
      <div className="loading-screen">
        <h2>VideoConnect</h2>
        <p>Connecting to meeting...</p>
      </div>
    );
  }

  return (
    <div className="room-wrapper">

      <div className="room-code">
        <span>🔗 {roomId}</span>

        <button
          className="copy-btn"
          onClick={copyRoomCode}
        >
          Copy
        </button>
      </div>

      <div className="meeting-timer">
        ⏱ {formatTime(seconds)}
      </div>

      {!showChat && (
        <button
          className="chat-btn"
          onClick={() => setShowChat(true)}
        >
          💬 Chat
        </button>
      )}

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
  );
}

export default Room;
