import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"

const socket = io("https://videoconnect-production-05db.up.railway.app")

function Chat({ roomId, username, onClose }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    socket.emit("join-room", roomId)

    socket.on("receive-message", ({ message, sender }) => {
      setMessages((prev) => [...prev, { message, sender }])
    })

    return () => {
      socket.off("receive-message")
    }
  }, [roomId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("send-message", {
        room: roomId,
        message: newMessage,
        sender: username
      })
      setNewMessage("")
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <div style={{
      position: "fixed",
      right: 0,
      top: 0,
      height: "100vh",
      width: "300px",
      background: "#1a1a2e",
      borderLeft: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      flexDirection: "column",
      zIndex: 1000,
    }}>

      {/* Header */}
      <div style={{
        padding: "20px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h3 style={{ color: "white", margin: 0 }}>💬 Group Chat</h3>
        <button onClick={onClose} style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.5)",
          fontSize: "20px",
          cursor: "pointer"
        }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
        {messages.length === 0 && (
          <p style={{
            color: "rgba(255,255,255,0.3)",
            textAlign: "center",
            marginTop: "20px",
            fontSize: "13px"
          }}>
            No messages yet. Say hi! 👋
          </p>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.sender === username
          return (
            <div key={i} style={{
              alignSelf: isMe ? "flex-end" : "flex-start",
              maxWidth: "80%"
            }}>
              <div style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "3px",
                textAlign: isMe ? "right" : "left"
              }}>
                {isMe ? "You" : msg.sender}
              </div>
              <div style={{
                background: isMe
                  ? "linear-gradient(135deg, #7c6ff7, #5b4fcf)"
                  : "rgba(255,255,255,0.08)",
                color: "white",
                padding: "10px 14px",
                borderRadius: isMe
                  ? "18px 18px 4px 18px"
                  : "18px 18px 18px 4px",
                fontSize: "14px",
              }}>
                {msg.message}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "15px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        gap: "10px"
      }}>
        <input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKey}
          style={{
            flex: 1,
            padding: "10px 14px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "12px",
            color: "white",
            fontSize: "14px",
            outline: "none"
          }}
        />
        <button onClick={sendMessage} style={{
          padding: "10px 16px",
          background: "linear-gradient(135deg, #7c6ff7, #5b4fcf)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "16px"
        }}>➤</button>
      </div>

    </div>
  )
}

export default Chat