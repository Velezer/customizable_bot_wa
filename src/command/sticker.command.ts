import { proto } from "@adiwajshing/baileys";
import { BotWa } from "../botwa/botwa";
import { GroupChat } from "../groups/group.chat";
import { BotLevel } from "../groups/interface";
import { Command, CommandLevel } from "./interface";

export class StickerCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/sticker';
    example: string = '/sticker';
    description: string = 'membuat sticker';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string, quotedMessage: proto.IMessage): Promise<void> {
        const jid = groupChat.jid

        quotedMessage.stickerMessage
        console.log(quotedMessage.imageMessage?.jpegThumbnail)
        const buffer = quotedMessage.imageMessage?.jpegThumbnail as Buffer
        // botwa.sendSticker(jid,)
        await botwa.sendImage(jid, buffer)
        await botwa.sendSticker(jid, buffer)

    }
}
