import { proto } from "@adiwajshing/baileys"
import { BotWa } from "../botwa"
import { GroupChat } from "../groups/group.chat"
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

    run(botwa: BotWa, groupChat: GroupChat, conversation: string, quotedMessage?: proto.IMessage, receivedMessage?: proto.WebMessageInfo): Promise<void>
}

