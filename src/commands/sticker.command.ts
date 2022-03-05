import { Mimetype, proto } from "@adiwajshing/baileys";
import Jimp from "jimp";
import { BotWa } from "../botwa";
import { GroupChat } from "../groups/group.chat";
import { BotLevel } from "../groups/interface";
import { Command, CommandLevel } from "./interface";

export class StickerCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/sticker';
    example: string = '/sticker';
    description: string = 'membuat sticker';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string, quotedMessage: proto.IMessage, receivedMessage: proto.WebMessageInfo): Promise<void> {
        const jid = groupChat.jid
        const img = await botwa.sock.downloadAndSaveMediaMessage(receivedMessage, './storage/media')
        const jimp = await Jimp.read(img)
        const buffer: Buffer = await jimp.getBufferAsync(Mimetype.webp)
        await botwa.sendSticker(jid, buffer)

    }
}
