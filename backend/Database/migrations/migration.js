import { pool } from "../db.js";

export async function runDb(){
    try {
        console.log("Creating Database tables")
        await pool.query(`
            CREATE TABLE IF NOT EXISTS userinfo (
            username VARCHAR(20) NOT NULL UNIQUE PRIMARY KEY,
            password VARCHAR(50) NOT NULL,
            role VARCHAR(20) NOT NULL,
            displayname VARCHAR(20) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)
        console.log("created userdinfo table")
    } catch (error) {
        console.log("error is creating db",error)
    }
}