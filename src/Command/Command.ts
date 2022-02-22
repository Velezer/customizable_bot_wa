import { proto } from "@adiwajshing/baileys"
import { BotWa } from "../BotWa/BotWa"


export interface Command {
    key: string
    description: string
    groupAdminOnly?: boolean

    cb(botwa: BotWa, to: string, receivedMessage: string): Promise<void>
}