import { Pool } from 'pg'
import { config } from 'dotenv';

const dbServer = {
    host: config().parsed.GAME_DB_HOST,
    port: Number(config().parsed.GAME_DB_PORT),
    user: config().parsed.GAME_DB_USERNAME,
    password: config().parsed.GAME_DB_PASSWORD,
    database:config().parsed.GAME_DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
    max: 20,
}

const pool = new Pool(dbServer)


export default class Database {
    static query = async (sql: any) => {
        const res = await pool.query(sql)
        return res;
    }
}

