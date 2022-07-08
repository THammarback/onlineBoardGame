import {Component, For, JSXElement} from 'solid-js';
import {Session, formElement } from '../types';
// import styles from './Chat.module.css';


const Chat:Component<{session:Session}> = ({session}) => {

  const ChatItem:Component<{children:JSXElement}> = ({children}) => {
    return (
      <li>{children}</li>
    )
  }

  session.socket.on('receiveChat', (newMessages)=>{
    console.log(newMessages, session.messages.get())
    session.messages.set((currentMessages) => [...currentMessages, ...newMessages])
  })

  const sendChat = (e:SubmitEvent) =>{
    e.preventDefault();
    const newMessage = (e.target as formElement).message.value;
    session.socket.emit('sendChat', newMessage)
    session.messages.set((currentMessages)=>{
      console.log(session.messages.get())
      return [...currentMessages, newMessage]
    })
  }

  return(
    <section class={"chat"}>
      <ol class={"chatList"} id="chatList">
        <For each={session.messages.get()}>{(message, i) =>
          <ChatItem>{message}</ChatItem>
        }</For>
      </ol>
      <form onSubmit={sendChat}>
        <input type='text' name="message"/>
        <input type="submit"/>
      </form>
    </section>
  )
}

export default Chat