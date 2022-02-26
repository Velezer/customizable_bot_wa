import { BotWa } from "../BotWa/BotWa"
import { GroupChat } from "../groups/Group"

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

    run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void>
}

