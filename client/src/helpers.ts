import { createSignal, Setter, Accessor} from "solid-js";

const state = <T>(init:T) => new State<T>(init)
class State<T>{
  set: Setter<T>;
  get: Accessor<T>;
  constructor(init: T){
    [this.get, this.set] = createSignal(init);
  }
}

const parseCookie = (str:string) =>
  str
    .split(';').filter(x=>x)
    .map(v => v.split('='))
    .reduce((acc: {[key: string]: string}, v: string[]) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

export {state, State, parseCookie}
