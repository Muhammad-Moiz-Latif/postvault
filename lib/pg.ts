import { Pool } from 'pg';


const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT), // convert string to number
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // not `name`
});

export default pool;
