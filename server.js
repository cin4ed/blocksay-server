import { createServer } from 'http'
import { Server } from 'socket.io'
import migrations from './migrations.js'
import ConnectionController from './controllers/ConnectionController.js'
import MessageController from './controllers/MessageController.js'

// First we 
migrations.run()

// Socket.io
const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  // Connection
  ConnectionController.Connection(socket, io);
  socket.on('disconnect', (data) => ConnectionController.Disconnect(socket, io, data))

  // Messages
  socket.on('message:list', (data) => MessageController.List(socket, io, data))
  socket.on('message:create', (data) => MessageController.Create(socket, io, data))
})

httpServer.listen(3000)
