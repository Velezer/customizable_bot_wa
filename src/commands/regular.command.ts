import { CekCommand } from "./cek.command"
import { TagAllCommand, GetGroupMetadataCommand, OpenGroupSettingsCommand, CloseGroupSettingsCommand, OpenGroupChatCommand, CloseGroupChatCommand} from "./commands"
import { AddCustomMenuCommand, RemoveCustomMenuCommand, UpdateCustomMenuCommand } from "./menu/crud.menu.command"
import { Command } from "./interface"
import { BotMenuBasicCommand, GroupMenuBasicCommand, ImageMenuBasicCommand } from "./menu/menu.basic.command"
import { GroupMenuElegantCommand, ImageMenuElegantCommand } from "./menu/menu.elegant.command"
import { StickerCommand } from "./sticker.command"
import { DeleteBotTypoCommand } from "./delete.command"
import { KickCommand } from "./group/kick.command"
import { DemoteCommand } from "./group/demote.command"
import { PromoteCommand } from "./group/promote.command"
import { AddImageMenuCommand } from "./menu/crud.image.command"
import { YTStatusCommand } from './yt-status.command';


export const allCommands: Command[] = [
    new CekCommand(),
    new TagAllCommand(),
    new DeleteBotTypoCommand(),
    new KickCommand(),
    new StickerCommand(),
    new YTStatusCommand(),
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
    new GroupMenuElegantCommand(),
    new GroupMenuBasicCommand(),
    new AddImageMenuCommand(),
    new ImageMenuElegantCommand(),
    new ImageMenuBasicCommand(),
]

allCommands.push(new BotMenuBasicCommand(allCommands))
// allCommands.push(new BotMenuElegantCommand(allCommands))