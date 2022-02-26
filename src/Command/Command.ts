import { BotWa } from "../BotWa/BotWa"
import { GroupChat } from "../groups/Group"
import { ActivateCommand, CekCommand, CloseGroupChatCommand, CloseGroupSettingsCommand, CustomMenuCommand, DeactivateCommand, DemoteCommand, GetGroupMetadataCommand, JoinGroupCommand, MenuCommand, OpenGroupChatCommand, OpenGroupSettingsCommand, PromoteCommand, RegisterGroupCommand, RemoveCustomMenuCommand, TagAllCommand } from "./commands"

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
    new RegisterGroupCommand(),
    new CustomMenuCommand(),
    new RemoveCustomMenuCommand(),
    new ActivateCommand(),
    new DeactivateCommand()
]

allCommands.push(new MenuCommand(allCommands))