import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./Chat.css";

const socket = io(
  "https://videoconnect-production-05db.up.railway.app"
);

function Chat({ roomId, username, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("receive-message", ({ message, sender }) => {
      setMessages((prev) => [
        ...prev,
        {
          message,
          sender,
          time: getCurrentTime(),
        },
      ]);
    });

    socket.on("system-message", ({ text }) => {
      setMessages((prev) => [
        ...prev,
        {
          message: text,
          sender: "System",
          time: getCurrentTime(),
          system: true,
        },
      ]);
    });

    return () => {
      socket.off("receive-message");
      socket.off("system-message");
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socket.emit("send-message", {
      room: roomId,
      message: newMessage,
      sender: username,
    });

    setNewMessage("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-sidebar">

      <div className="chat-header">
        <h3 className="chat-title">
          💬 Meeting Chat
        </h3>

        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className="chat-messages">

        {messages.length === 0 && (
          <p className="empty-chat">
            No messages yet. Say hello 👋
          </p>
        )}

        {messages.map((msg, i) => {

          if (msg.system) {
            return (
              <div
                key={i}
                className="system-message"
              >
                {msg.message}
              </div>
            );
          }

          const isMe = msg.sender === username;

          return (
            <div
              key={i}
              className={`message-wrapper ${
                isMe ? "me" : "other"
              }`}
            >
              <div
                className={`message-info ${
                  isMe ? "me" : "other"
                }`}
              >
                {isMe ? "You" : msg.sender}
                {" • "}
                {msg.time}
              </div>

              <div
                className={`message-bubble ${
                  isMe ? "me" : "other"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />

      </div>

      <div className="chat-input-area">

        <input
          className="chat-input"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) =>
            setNewMessage(e.target.value)
          }
          onKeyDown={handleKey}
        />

        <button
          className="send-btn"
          onClick={sendMessage}
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default Chat;
