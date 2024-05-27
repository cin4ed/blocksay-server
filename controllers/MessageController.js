import Logger from '../logger.js'
import database from '../database.js'

class MessageController {

  /**
  * return {
  *   "messsages": []
  * }
  */
  static async List(socket, _, data) {

    Logger.log(`SOCKET: message:list from ${socket.id}: ${data}`)

    const db = database.connect()

    db.all('SELECT * FROM messages', (err, rows) => {
      if (err) {
        Logger.log('DATABASE: Error selecting messages: ' + err.message)
      } else {
        Logger.log('DATABASE: Messages selected successfully');
        socket.emit('message:list', { messages: rows});
        Logger.log('SOCKET: message:list Messages sent');
      }
    })
  }

  static Create(socket, io, data) {

    Logger.log(`SOCKET: message:create from ${socket.id}: ${data}`)

    const db = database.connect()

    Message.Create()

    db.run('INSERT INTO messages (username, message) VALUES (?, ?)', [socket.id, data], (err) => {
      if (err) {
        Logger.log('DATABASE: Error inserting message: ' + err.message)
      } else {
        Logger.log('DATABASE: Message inserted successfully')
        io.emit('message:create', { id: socket.id, message: data })
        Logger.log('SOCKET: Message broadcasted')
      }
    })
  }
}

export default MessageController
