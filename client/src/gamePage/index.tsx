import {Component, onMount} from 'solid-js';
import {parseCookie, state} from '../helpers'
import {io} from "socket.io-client";
import Chat from './Chat';
import { Game } from '../types';
import { render } from 'solid-js/web';

const socket = io('localhost:4000')

const GamePage: Component = () => {
  const game:Game = {
    messages: state([] as string[]),
    socket: socket,
    key: state('')
  }

  const cookies = parseCookie(document.cookie)
  const urlPath = document.location.pathname.split('/')
  const key = urlPath.pop() || urlPath.pop() as string;
  
  const credentials = {
    name: cookies.displayName,
    key
  }
  if(!credentials.name || !credentials.key){
    console.log("Error with credentials:",credentials)
    //document.location.href = "/";
    return false;
  }

  const createSession = document.location.search === '?new';

  game.socket.emit(createSession? "createSession" : "joinSession", credentials, (res:any)=>{
    if(res.ok){
      game.key.set(credentials.key)
      game.messages.set(res.session.messages.reverse())
    }else{
      console.log(res.name, res.message)
      //document.location.href = "/"
    }
  })

  if(createSession){
    history.replaceState(null, "", "/"+credentials.key)
  }

  socket.on("disconnect", ()=>{
    document.location.href = "/";
    return false;
  })

  const pointRadius = 5;
  let resize = {x:false, y:false}
  let container: HTMLElement

  let width:number
  let height:number


  const onPoint = (e: MouseEvent) => {
    const w = width*window.innerWidth
    const h = height*window.innerHeight
    return {
      x: e.clientX-pointRadius < w && e.clientX+pointRadius > w && e.clientY-pointRadius<h,
      y: e.clientY-pointRadius < h && e.clientY+pointRadius > h && e.clientX-pointRadius<w,
    }
  }


  onMount(() =>{
    width = parseFloat(getComputedStyle(container).getPropertyValue('--width'))/100
    height = parseFloat(getComputedStyle(container).getPropertyValue('--height'))/100
  })

  document.addEventListener('mousedown', (e:MouseEvent) => {
    resize = onPoint(e)
    if(resize.x || resize.y) e.preventDefault()
  })

  document.addEventListener('mousemove', (e:MouseEvent) => {
    if(resize.x || resize.y) e.preventDefault()

    if(resize.x && container){
      width = e.clientX/window.innerWidth
      container.style.setProperty('--width', width*100+'vw')
    }    
    if(resize.y && container){
      height = e.clientY/window.innerHeight
      container.style.setProperty('--height', height*100+'vh')
    }
    
    const on = onPoint(e)
    if((on.x && on.y) || (resize.x && resize.y)){
      document.body.style.cursor = "nwse-resize"
    }else if(on.x || resize.x){
      document.body.style.cursor = "ew-resize"
    }else if(on.y || resize.y){
      document.body.style.cursor = "ns-resize"
    } else{
      document.body.style.cursor = ""
    }
  })

  document.addEventListener('mouseup', (e:MouseEvent) => {
    resize = {x:false, y:false}
  })

  return (
    <section ref={container!} class="container">
      <div class="leftCol">
        <canvas id="imageArea"></canvas>
        <Chat game={game}/>
      </div>
      <div class="rightCol">
        <p>
          test paragraph, i should make it a bit longer just to see what happens when i make the column longer or shorter :D.
        </p>
      </div>
    </section>
  );
};

render(() => <GamePage />, document.getElementById('root') as HTMLElement)
