import database from './database.js';
import Logger from './logger.js'

const migrations = [
    `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
]

class Migrations {
    static run() {
        const db = database.connect()

        migrations.forEach((migration) => {
            db.run(migration, (err) => {
                if (err) {
                    Logger.log('DATABASE: Error creating table: ' + err.message)
                } else {
                    Logger.log('DATABASE: Table created successfully.')
                }
            })
        })
    }
}

export default Migrations
