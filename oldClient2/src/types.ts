import {State} from './helpers'
import { Socket } from "socket.io-client";

type Session = {socket:Socket, messages : State<string[]>, key: State<string>}
type formElement = EventTarget & {[keys: string]: HTMLInputElement}

export type {Session, formElement}