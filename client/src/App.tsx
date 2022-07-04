import {Component, Show, Signal} from 'solid-js';
import {state} from '../helpers'
import styles from './App.module.css';
import Login from './Login';
import { io, Socket } from "socket.io-client";
import Chat from './Chat';
import { Session } from '../types';

const socket = io(import.meta.env.VITE_SERVER_ADDRESS+':'+import.meta.env.VITE_SERVER_PORT)

const App: Component = () => {
  const session:Session = {
    messages: state([] as string[]),
    socket: socket,
    key: state('')
  }
  socket.on("disconnect", ()=>{
    session.key.set('')
    session.messages.set([] as string[])
  })

  return (
    <Show when={session.key.get()} fallback={<Login session={session}/>}>
      <section class={styles.main}>
        <Chat session={session}/>
      </section>
    </Show>
  );
};

export default App;
