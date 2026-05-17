import express from 'express'
import compression from 'compression'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {connectDb, pool} from './Database/db.js'
import { manageroutes } from './Routes/routes.js'
import { runDb } from './Database/migrations/migration.js'

const router = express.Router()
export const app = express()
const port = `${process.env.PORT}`

app.use(cors( {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}),compression(),express.json(),cookieParser());

manageroutes(app)

async function defaultload(){
    await runDb()
    const admin = await pool.query('SELECT * FROM userinfo WHERE username=$1',['admin']);
    if(admin.rowCount !=0){
      console.log("admin exists")
    }else{
      console.log("admin does not exists trying to create admin")
      const createAdmin = await pool.query('INSERT INTO userinfo(username,password,role,displayname) VALUES ($1,$2,$3,$4) RETURNING *',[`${process.env.DEFAULT_USERNAME}`,`${process.env.DEFAULT_PASSWORD}`,'admin',`${process.env.DEFAULT_DISPLAYNAME}`])
      if(createAdmin.rowCount===1){
        console.log("admin created");
      }
    }
}

async function start(){
  try {
    await connectDb();
    await defaultload();
    app.listen(port, () => {
      console.log(`server running on  http://localhost:${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}
start()
