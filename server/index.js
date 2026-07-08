const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { AccessToken } = require('livekit-server-sdk')
require('dotenv').config()

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

app.use(cors({ origin: "*" }))
app.use(express.json())

// Route to generate LiveKit token
app.get('/token', async (req, res) => {
  const { room, username } = req.query

  if (!room || !username) {
    return res.status(400).json({ error: 'Room and username are required' })
  }

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: username }
  )

  at.addGrant({ roomJoin: true, room: room })

  const token = await at.toJwt()

  res.json({ token, url: process.env.LIVEKIT_URL })
})

// Socket.io for chat
const roomUsers = {}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-room', ({ room, username }) => {
    socket.join(room)

    socket.room = room
    socket.username = username

    if (!roomUsers[room]) {
      roomUsers[room] = []
    }

    roomUsers[room].push(username)

    io.to(room).emit('participant-count', roomUsers[room].length)

    io.to(room).emit('system-message', {
      text: `${username} joined the meeting`
    })

    console.log(`${username} joined room ${room}`)
  })

  socket.on('send-message', ({ room, message, sender }) => {
    io.to(room).emit('receive-message', {
      message,
      sender
    })
  })

  socket.on('disconnect', () => {
    const room = socket.room
    const username = socket.username

    if (room && roomUsers[room]) {

      roomUsers[room] =
        roomUsers[room].filter(
          user => user !== username
        )

      io.to(room).emit('participant-count',
        roomUsers[room].length
      )

      io.to(room).emit('system-message', {
        text: `${username} left the meeting`
      })

      if (roomUsers[room].length === 0) {
        delete roomUsers[room]
      }
    }

    console.log('User disconnected:', socket.id)
  })
})
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
