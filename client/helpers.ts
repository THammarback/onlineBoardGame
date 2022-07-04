import { createSignal, Setter, Accessor} from "solid-js";

const state = <T>(init:T) => new State<T>(init)
class State<T>{
  set: Setter<T>;
  get: Accessor<T>;
  constructor(init: T){
    [this.get, this.set] = createSignal(init);
  }
}

export {state, State}