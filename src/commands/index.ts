import { CekCommand } from "./cek.command"
import { TagAllCommand, GetGroupMetadataCommand, OpenGroupSettingsCommand, CloseGroupSettingsCommand, OpenGroupChatCommand, CloseGroupChatCommand} from "./commands"
import { AddCustomMenuCommand, RemoveCustomMenuCommand, UpdateCustomMenuCommand } from "./menu/crud.menu.command"
import { Command } from "./interface"
import { BotMenuBasicCommand, GroupMenuBasicCommand } from "./menu/menu.basic.command"
import { GroupMenuElegantCommand } from "./menu/menu.elegant.command"
import { StickerCommand } from "./sticker.command"
import { DeleteBotTypoCommand } from "./delete.command"
import { KickCommand } from "./group/kick.command"
import { DemoteCommand } from "./group/demote.command"
import { PromoteCommand } from "./group/promote.command"
import { YTStatusCommand } from './yt-status.command';
import { SetWelcomeCommand } from "./group/setwelcome"
import { TranslateCommand } from "./translate.command"
import { SetLeaveCommand } from './group/setleave';
import { CalcCommand } from './calc.command';


export const allCommands: Command[] = [
    new CekCommand(),
    new TagAllCommand(),
    new CalcCommand(),
    new DeleteBotTypoCommand(),
    new KickCommand(),
    new StickerCommand(),
    new YTStatusCommand(),
    new TranslateCommand(),
    new GetGroupMetadataCommand(),
    new OpenGroupSettingsCommand(),
    new SetWelcomeCommand(),
    new SetLeaveCommand(),
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
]

allCommands.push(new BotMenuBasicCommand(allCommands))