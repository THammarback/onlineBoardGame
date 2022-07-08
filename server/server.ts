import express from 'express'
import dotenv from 'dotenv'
import {createServer} from "http"
import {Server} from "socket.io"
import Session from './Session.js'
import onConnection from './socket.js'

dotenv.config({path: '../.env'})


const app = express()

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors:{
    origin: "*"
  }
})

app.get('/debug', (req, res) => {
  res.send(`<pre>${JSON.stringify(
    Object.entries(Session.instances).map(([sessionName, value])=>(
      {
        sessionName: sessionName,
        names: value.names,
        assets: value.assets,
        messages: value.messages,
      }
    )), null, 2)}</pre>`)
})

app.use(express.static('../www'))
io.on("connection", onConnection)


httpServer.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running at https://localhost:${process.env.SERVER_PORT}`)
})
