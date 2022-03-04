import { BotWa } from "../BotWa/BotWa";


export interface Handler<T> {
    botwa: BotWa

    handlers: T[]

    run(...args: any): any
}