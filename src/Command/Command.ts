import { proto } from "@adiwajshing/baileys"
import { BotWa } from "../BotWa/BotWa"
import { CekCommand, CloseGroupChatCommand, CloseGroupSettingsCommand, DemoteCommand, GetGroupMetadataCommand, JoinGroupCommand, OpenGroupChatCommand, OpenGroupSettingsCommand, PromoteCommand, RegisterGroupCommand, TagAllCommand } from "./commands"

export enum CommandLevel {
    MEMBER,
    ADMIN,
    DEVELOPER
}

export interface Command {
    key: string
    example: string
    description: string
    level: CommandLevel

    run(botwa: BotWa, jid: string, conversation: string): Promise<void>
}

export const allCommands = [
    // new ActivateCommand(), // must be top on list
    new CekCommand(),
    new TagAllCommand(),
    new GetGroupMetadataCommand(),
    // new GetGroupParticipantsCommand(),
    new OpenGroupSettingsCommand(),
    new CloseGroupSettingsCommand(),
    new OpenGroupChatCommand(),
    new CloseGroupChatCommand(),
    new PromoteCommand(),
    new DemoteCommand(),
    new JoinGroupCommand(),
    new RegisterGroupCommand()
]