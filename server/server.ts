import express from 'express'
import cookieParser from 'cookie-parser';
import path from 'path'
import dotenv from 'dotenv'
import {createServer} from 'http'
import {Server} from 'socket.io'
import Session from './Session.js'
import onConnection from './socket.js'


dotenv.config({path: '../.env'})

const publicPath = path.resolve('../www')
const app = express()
app.use(cookieParser());

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

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/*.js', express.static(publicPath+'/js/'))
app.get('/*.css', express.static(publicPath+'/css/'))

app.get('/:id', (req, res) => {
  const localError = (err?:string) => {
    if(err){
      res.cookie('Error', err)
      if(req.params.id) res.cookie('lastKey', req.params.id)
      console.log("User failed while trying to get to gamePage", {
        id: req.params.id,
        isCreated: req.params.id && (req.params.id in Session.instances),
        displayName: 'displayName' in req.cookies,
        new: 'new' in req.query
      })

    }
    res.redirect('/')
  }

  if(!req.params.id)
    localError();
  else if(!('displayName' in req.cookies))
    localError("No name set.")
  else if(!(req.params.id in Session.instances || 'new' in req.query))
    localError('Session does not exist or "new" is missing to create it.')
  else if(req.params.id in Session.instances && 'new' in req.query)
    localError('Session already exists, join it instead')
  else if(req.params.id in Session.instances && 'displayName' in req.cookies && Object.values(Session.instances[req.params.id].names).includes(req.cookies.displayName))
    localError('User with that name already exists in the session, choose something else.')
  else {
    res.sendFile(publicPath+'/html/gamePage.html')
  }
})

app.get('/', (req, res) => {
  res.sendFile(publicPath+'/html/index.html')
})

/* Start of socket connection */
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors:{
    origin: "*"
  }
})
io.on("connection", onConnection)

httpServer.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running at https://localhost:${process.env.SERVER_PORT}`)
})
