import pg from 'pg'
const { Pool, Client } = pg


const connectionString = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
export const pool = new Pool({connectionString})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
})

export async function connectDb(){
    try {
        const result = await pool.query('SELECT NOW()')
        console.log(`connected to ${process.env.DB_NAME}`, result.rows[0])
        return true;
    } catch (error) {
        console.error(`cannot connect to ${process.env.DB_NAME}`, error.message)
        return false;
    }
}

export const query = (text, params) => pool.query(text, params)