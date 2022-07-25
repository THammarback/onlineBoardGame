import {Component, For, JSXElement} from 'solid-js';
import {Game} from '../types';

const Chat = ({game}:{game:Game}) => {
  const ChatItem:Component<{children:JSXElement}> = ({children}) => {
    return (
      <li>{children}</li>
    )
  }

  let chatList: HTMLOListElement;

  game.socket.on('receiveChat', (newMessages)=>{
    game.messages.set((currentMessages) => [...newMessages, ...currentMessages])
  })

  const sendChat = (e:SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement
    const newMessage = form.message.value.trim()
    form.message.value = ""
    if(!newMessage) return;
    game.socket.emit('sendChat', newMessage)
    game.messages.set((currentMessages)=>{
      return [newMessage, ...currentMessages]
    })
  }

  return(
    <section class="chat">
      <ol class="chatList" ref={chatList!}>
        <For each={game.messages.get()}>{(message, i) =>
          <ChatItem>{message}</ChatItem>
        }</For>
      </ol>
      <form onSubmit={sendChat} autocomplete="off">
        <input type='text' name="message"/>
        <input type="submit" value="send"/>
      </form>
    </section>
  )
}

export default Chat