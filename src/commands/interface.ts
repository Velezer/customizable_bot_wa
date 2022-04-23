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
    conversation: string
    groupChat?: GroupChatEntity
    services?: Services
    quotedMessage?: proto.IMessage
    receivedMessage?: proto.IWebMessageInfo
}

export interface Command {
    key: string
    example: string
    description: string
    level: CommandLevel
    botLevel: BotLevel

    run(args: RunArgs): Promise<any>
}

