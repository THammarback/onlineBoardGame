import express from 'express'
import dotenv from 'dotenv'
import {createServer} from "http"
import {Server, Socket} from "socket.io"
import Session from './Session'

dotenv.config({path: '../.env'})


const app = express()

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors:{
    origin: "*"
  }
})

app.get('/', (req, res) => {
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

io.on("connection", (socket) => {
  let session:Session

  socket.on("joinSession", ({key, name}, cb) => {
    try{
      session = Session.join(key, name, socket)
      console.log("Successfully joined:", {key, name})
      cb({ok:true, session:{messages: session.messages, assets: session.assets}})
    }catch(er){
      const error = er as Error; 
      console.log("Failed to join:", {key, name, error:error.message})
      cb({ok:false, name:error.name, message:error.message})
    }
  });

  socket.on("createSession", ({key, name}, cb) => {
    try{
      session = Session.create(key, name, socket)
      console.log("Successfully created session:", {key, name})
      cb({ok:true, session:{messages: session.messages, assets: session.assets}})
    }catch(er){
      const error = er as Error; 
      console.log("Failed to create session:", {key, name, error:error.message})
      cb({ok:false, name:error.name, message:error.message})
    }
  })

  socket.on("sendChat", (message)=>{
    if(session){
      session.messages.push(message)
      socket.to(session.key).emit('receiveChat', [message])
    }else{
      throw Error("Trying to send chat without any session")
    }
  })

  socket.on("disconnect", () => {
    if(session){
      session.removeUser(socket)
      console.log("removed user with id: "+socket.id+".")
    }
  });
});


httpServer.listen(process.env.VITE_SERVER_PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${process.env.VITE_SERVER_PORT}`)
})
