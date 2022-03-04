import { BotWa } from "../botwa/botwa";


export interface Handler<T> {
    botwa: BotWa

    handlers: T[]

    run(...args: any): any
}