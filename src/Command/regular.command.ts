import { CekCommand } from "./cek.command"
import { TagAllCommand, GetGroupMetadataCommand, OpenGroupSettingsCommand, CloseGroupSettingsCommand, OpenGroupChatCommand, CloseGroupChatCommand, PromoteCommand, DemoteCommand, JoinGroupCommand, ActivateCommand, DeactivateCommand } from "./commands"
import { AddCustomMenuCommand, RemoveCustomMenuCommand, UpdateCustomMenuCommand } from "./crud.menu.command"
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
    new AddCustomMenuCommand(),
    new UpdateCustomMenuCommand(),
    new RemoveCustomMenuCommand(),
    new ActivateCommand(),
    new DeactivateCommand(),
    new GroupMenuCommand()
]

allCommands.push(new BotMenuCommand(allCommands))