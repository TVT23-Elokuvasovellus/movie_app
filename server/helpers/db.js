import pkg from 'pg'
/*import dotenv from 'dotenv'


const environment = process.env.NODE_ENV
dotenv.config()*/

const { Pool } = pkg
const openDb = () => {
    const pool = new Pool ({
        user: "postgres",
        host: "localhost",
        database: "movie",
        password: "root",
        port: 5432
    })
    return pool
}

const pool = openDb()
export { pool }