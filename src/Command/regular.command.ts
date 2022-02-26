import { CekCommand } from "./cek.command"
import { TagAllCommand, GetGroupMetadataCommand, OpenGroupSettingsCommand, CloseGroupSettingsCommand, OpenGroupChatCommand, CloseGroupChatCommand, PromoteCommand, DemoteCommand, JoinGroupCommand, CustomMenuCommand, RemoveCustomMenuCommand, ActivateCommand, DeactivateCommand, MenuCommand } from "./commands"


export const allCommands = [
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
    new CustomMenuCommand(),
    new RemoveCustomMenuCommand(),
    new ActivateCommand(),
    new DeactivateCommand()
]

allCommands.push(new MenuCommand(allCommands))