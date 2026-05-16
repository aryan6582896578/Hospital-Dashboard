import express from 'express'
import compression from 'compression'
import 'dotenv/config'
import cors from 'cors'
import {connectDb} from './Database/db.js'

const router = express.Router()
export const app = express()
const port = `${process.env.PORT}`

app.use(cors(),compression(),express.json());


async function start(){
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`server running on  http://localhost:${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}
start()
