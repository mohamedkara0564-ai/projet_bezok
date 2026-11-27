import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

// En production (Render), DATABASE_URL est fournie directement
// En développement local, on utilise les variables séparées
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // requis sur Render
    })
    : new Pool({
        host:     process.env.DB_HOST,
        port:     process.env.DB_PORT,
        database: process.env.DB_NAME,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        client_encoding: "UTF8"
    });

pool.query("SELECT NOW()")
    .then(() => console.log("Connexion PostgreSQL établie"))
    .catch(err => console.error("Erreur PostgreSQL :", err.message));

export default pool;