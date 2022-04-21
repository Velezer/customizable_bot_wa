import { proto } from "@adiwajshing/baileys"
import { BotWa } from "../botwa"
import { BotLevel } from "../groups/interface"
import { GroupChatEntity } from "../typeorm/entity/GroupChatEntity"
import { Services } from './../typeorm/service/interface';

export enum CommandLevel {
    MEMBER,
    ADMIN,
    OCEDBOT
}

export interface RunArgs {
    botwa: BotWa
    groupChat?: GroupChatEntity
    services?: Services
    conversation: string
    quotedMessage?: proto.IMessage
    receivedMessage?: proto.IWebMessageInfo
    messages?: proto.IWebMessageInfo[]
}

export interface Command {
    key: string
    example: string
    description: string
    level: CommandLevel
    botLevel: BotLevel

    run(args: RunArgs): Promise<any>
}

