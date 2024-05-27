import { fileURLToPath } from "url";
import sqlite3 from 'sqlite3'
import path from 'path'
import Logger from './logger.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class Database {
    static path =  path.join(__dirname, 'database.sqlite')
    static instance = null

    /**
     * Initialize the database
     *
     * @returns {void}
     */
    static init() {
        if (!Database.instance) {
            Database.instance = new sqlite3.Database(Database.path, (err) => {
                if (err) {
                    Logger.log('DATABASE: Error creating the database: ' + err.message)
                } else {
                    Logger.log('DATABASE: Database created successfully.')
                }
            })
        }
    }

    /**
     * Connect to the database
     *
     * @returns {sqlite3.Database} The database instance
     */
    static connect() {
        if (!Database.instance) {
            Database.init()
            return Database.instance
        } else {
            return Database.instance
        }
    }

    /**
     * Close the database connection
     *
     * @returns {void}
     */
    static shutdown() {
        if (Database.instance) {
            Database.instance.close((err) => {
                if (err) {
                    Logger.log('DATABASE: Error closing the database: ' + err.message)
                } else {
                    Logger.log('DATABASE: Database connection closed.')
                }
            })
        }
    }

    /**
     * Run the database migrations
     *
     * @returns {void}
     */
    static runMigrations() {
        const db = Database.connect()

        Database.migrations.forEach((migration) => {
            db.run(migration.sql, (err) => {
                if (err) {
                    Logger.log(`DATABASE: Error creating table ${migration.table}: ${err.message}`)
                } else {
                    Logger.log(`DATABASE: Table ${migration.table} created successfully.`)
                }
            })
        })
    }
}

export default Database
