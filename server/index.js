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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

app.use(cors())
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
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-room', (room) => {
    socket.join(room)
    console.log(`User joined room: ${room}`)
  })

  socket.on('send-message', ({ room, message, sender }) => {
    io.to(room).emit('receive-message', { message, sender })
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})