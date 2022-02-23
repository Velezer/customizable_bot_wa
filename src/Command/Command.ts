import { proto } from "@adiwajshing/baileys"
import { BotWa } from "../BotWa/BotWa"


export interface Command {
    key: string
    example: string
    description: string

    run(botwa: BotWa, jid: string, receivedMessage: string): Promise<void>
}