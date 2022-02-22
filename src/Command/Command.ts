import { proto } from "@adiwajshing/baileys"
import { BotWa } from "../BotWa/BotWa"


export interface Command {
    key: string
    description: string

    cb(botwa: BotWa, to: string, receivedMessage: string): Promise<void>
}