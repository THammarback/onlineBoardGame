import {State} from './helpers'
import { Socket } from "socket.io-client";

type Game = {socket:Socket, messages : State<string[]>, key: State<string>}

export type {Game}