import dotenv from 'dotenv';
import pkg from 'pg'

const { Pool } = pkg
dotenv.config();


const dbServer = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
    max: 20,
}

const pool = new Pool(dbServer)
  
export default class Database {
    static query = async (sql) => {
        const res = await pool.query(sql)
        return res;
    }
}

