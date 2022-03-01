import { proto } from "@adiwajshing/baileys"
import { BotWa } from "../BotWa/BotWa"
import { GroupChat } from "../groups/GroupChat"
import { BotLevel } from "../groups/interface"

export enum CommandLevel {
    MEMBER,
    ADMIN,
    OCEDBOT
}

export interface Command {
    key: string
    example: string
    description: string
    level: CommandLevel
    botLevel: BotLevel

    run(botwa: BotWa, groupChat: GroupChat, conversation: string, msgKey?: proto.IMessageKey): Promise<void>
}

