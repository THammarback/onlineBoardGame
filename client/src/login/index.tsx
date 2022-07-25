import { render } from 'solid-js/web'
import type {Component} from 'solid-js'
import { parseCookie } from '../helpers'
// import styles from './Login.module.css'

const validateLoginInput = ({name, key}: {name?:string, key?:string} )=>{
  if(!name){
    console.warn("Enter something in the Display Name key field")
    return false
  }

  if(!key){
    console.warn("Enter something in the game key field")
    return false
  }
  return true
}

const Login: Component = () =>{
  const cookies = parseCookie(document.cookie)
  if(cookies.Error){
    console.log(cookies.Error)
    document.cookie = 'Error=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  const onSubmit = (e:SubmitEvent) => {
    e.preventDefault()
    const credentials = {
      key:(e.target as HTMLFormElement).gameKey.value,
      name:(e.target as HTMLFormElement).displayName.value
    }

    if(!validateLoginInput(credentials))
      return false

    if((e.submitter as HTMLInputElement).name === "create"){
      document.cookie = `displayName=${credentials.name}`;
      document.cookie = `lastKey=${credentials.key}`;
      window.location.href = `/${credentials.key}?new`

    }else if((e.submitter as HTMLInputElement).name === "join"){
      document.cookie = `displayName=${credentials.name}`;
      document.cookie = `lastKey=${credentials.key}`;
      window.location.href = `/${credentials.key}`
    }

  }

  return (
    <section class="login">
      <h2>Join or create a <br /> Gaming Session.</h2>
      <div>
        <form onsubmit={onSubmit}>
          <input type="text" name='displayName' value={cookies.displayName || ""} placeholder='Display name'/>
          <input type="text" name='gameKey' value={cookies.lastKey || ""} placeholder='Game key'/>
          <input type="submit" name="create" value="Create" />
          <input type="submit" name="join" value="Join" />
        </form>
      </div>
    </section>    
  )
}

render(() => <Login />, document.getElementById('root') as HTMLElement)
