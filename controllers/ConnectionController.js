import Logger from '../logger.js';

class ConnectionController {
  static Connection(socket, io) {
    Logger.log('SOCKET: User connected with id: ' + socket.id)
    io.emit('user connected', { id: socket.id })
  }

  static Disconnect(_, socket, io) {
    Logger.log('SOCKET: User disconnected with id: ' + socket.id)
    io.emit('user disconnected', { id: socket.id })
  }
}

export default ConnectionController
