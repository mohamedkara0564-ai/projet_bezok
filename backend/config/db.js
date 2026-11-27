import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const {Pool} = pg;
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    client_encoding: 'UTF8'
});
pool.query("SHOW client_encoding")
    .then(result => {
        console.log("Encodage PostgreSQL :", result.rows[0]);
    })
    .catch(error => {
        console.error(error.message);
    });
export default pool;