import type {Component} from 'solid-js';
import type {formElement, Session} from '../types';
// import styles from './Login.module.css';



const Login: Component<{session:Session}> = ({session}) =>{

  const onSubmit = (e:SubmitEvent) => {
    e.preventDefault();
    const key = (e.target as formElement).sessionKey.value
    const name = (e.target as formElement).displayName.value

    if(!name){
      console.warn("Enter something in the Display Name key field")
      return false;
    }

    if(!key){
      console.warn("Enter something in the session key field")
      return false;
    }

    if((e.submitter as HTMLInputElement).name === "create"){
      session.socket.emit("createSession", {key, name}, (res:any)=>{
        if(res.ok){
          session.key.set(key)
        } 
        else console.error(res)
      })
    }else if((e.submitter as HTMLInputElement).name === "join"){
      session.socket.emit("joinSession", {key, name}, (res:any)=>{
        if(res.ok){
          session.key.set(key)
          console.log(session.messages.get())
          session.messages.set(res.session.messages)
        } 
        else console.error(res)
      })
    }
  }

  return (
    <section class="login">
      <h2>Join or create a D&D Session.</h2>
      <div>
        <form onsubmit={onSubmit}>
          <input type="text" name='displayName' placeholder='Display name'/>
          <input type="text" name='sessionKey' placeholder='Session key'/>
          <input type="submit" name="create" value="Create" />
          <input type="submit" name="join" value="Join" />
        </form>
      </div>
    </section>    
  )
}

export default Login;