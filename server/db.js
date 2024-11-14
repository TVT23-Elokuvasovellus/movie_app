import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool ({
    user: "postgres",
    host: "localhost",
    database: "moviedb",
    password: "root",
    port: 5432
  })

export { pool }