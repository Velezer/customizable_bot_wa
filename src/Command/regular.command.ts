import { CekCommand } from "./cek.command"
import { TagAllCommand, GetGroupMetadataCommand, OpenGroupSettingsCommand, CloseGroupSettingsCommand, OpenGroupChatCommand, CloseGroupChatCommand, PromoteCommand, DemoteCommand, JoinGroupCommand, CustomMenuCommand, RemoveCustomMenuCommand, ActivateCommand, DeactivateCommand } from "./commands"
import { BotMenuCommand, GroupMenuCommand } from "./menu.command"


export const allCommands = [
    new CekCommand(),
    new TagAllCommand(),
    new GetGroupMetadataCommand(),
    new OpenGroupSettingsCommand(),
    new CloseGroupSettingsCommand(),
    new OpenGroupChatCommand(),
    new CloseGroupChatCommand(),
    new PromoteCommand(),
    new DemoteCommand(),
    new CustomMenuCommand(),
    new RemoveCustomMenuCommand(),
    new ActivateCommand(),
    new DeactivateCommand(),
    new GroupMenuCommand()
]

allCommands.push(new BotMenuCommand(allCommands))