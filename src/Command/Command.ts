import { proto } from "@adiwajshing/baileys"
import { BotWa } from "../BotWa/BotWa"


export abstract class Command {
    abstract key: string

    abstract cb(botwa: BotWa, to: string, receivedMessage: string): Promise<void>
}