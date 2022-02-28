import { BotWa } from "../BotWa/BotWa";


export interface UpdateHandler<T> {
    botwa: BotWa

    handlers: T[]
}