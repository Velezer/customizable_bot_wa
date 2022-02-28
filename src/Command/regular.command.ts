import { CekCommand } from "./cek.command"
import { TagAllCommand, GetGroupMetadataCommand, OpenGroupSettingsCommand, CloseGroupSettingsCommand, OpenGroupChatCommand, CloseGroupChatCommand, PromoteCommand, DemoteCommand, JoinGroupCommand } from "./commands"
import { AddCustomMenuCommand, RemoveCustomMenuCommand, UpdateCustomMenuCommand } from "./crud.menu.command"
import { Command } from "./interface"
import { BotMenuBasicCommand, GroupMenuBasicCommand } from "./menu.basic.command"
import { GroupMenuElegantCommand } from "./menu.elegant.command"


export const allCommands: Command[] = [
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
    // new ActivateCommand(),
    // new DeactivateCommand(),
    new GroupMenuElegantCommand(),
    new GroupMenuBasicCommand()
]

allCommands.push(new BotMenuBasicCommand(allCommands))
// allCommands.push(new BotMenuElegantCommand(allCommands))