import Logger from "../logger.js";
import database from "../database.js";

class MessageController {
  static async All() {
    const db = database.connect();

    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM messages", (err, rows) => {
        if (err) {
          Logger.log("DATABASE: Error selecting messages: " + err.message);
          reject(err);
        } else {
          Logger.log("SOCKET: message:list Messages sent");
          resolve(rows);
        }
      });
    });
  }

  static Create(message) {
    const db = database.connect();

    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO messages (sender, content) VALUES (?, ?)",
        [message.sender, message.content],
        function (err) {
          // use regular function to access this.lastID
          if (err) {
            Logger.log("DATABASE: Error inserting message: " + err.message);
            reject(err);
          } else {
            db.get(
              "SELECT * FROM messages WHERE id = ?",
              [this.lastID],
              (err, row) => {
                if (err) {
                  Logger.log(
                    "DATABASE: Error fetching inserted message: " + err.message
                  );
                  reject(err);
                } else {
                  Logger.log("DATABASE: Message inserted successfully");
                  resolve(row);
                }
              }
            );
          }
        }
      );
    });
  }
}

export default MessageController;
