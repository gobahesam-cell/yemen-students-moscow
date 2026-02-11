
import "dotenv/config";
import { Pool } from "pg";

async function testConnection() {
    const connectionString = process.env.DATABASE_URL;
    console.log("Testing connection to:", connectionString);
    const pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 2000
    });

    try {
        const client = await pool.connect();
        console.log("✅ Connection successful");
        const res = await client.query("SELECT NOW()");
        console.log("Server time:", res.rows[0]);
        client.release();
    } catch (err) {
        console.error("❌ Connection failed:", err);
    } finally {
        await pool.end();
    }
}

testConnection();
