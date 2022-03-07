import { proto } from "@adiwajshing/baileys";
import { BotWa } from "../../botwa";
import { GroupChat } from "../../groups/group.chat";
import { ImageStorage } from "../../groups/group.image.storage";
import { BotLevel, ImageEntity } from "../../groups/interface";
import { Helper } from "../../helper/helper";
import { Command, CommandLevel } from "../interface";


export class AddImageMenuCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/add-image';
    example: string = '/add-image nama-gambar';
    description: string = 'menambahkan gambar';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string, quotedMessage: proto.IMessage, receivedMessage: proto.WebMessageInfo): Promise<void> {
        const jid = groupChat.jid
        if (!receivedMessage.message?.imageMessage) {
            botwa.sendMessage(jid, 'kasi gambarnya')
            return
        }
        let m1 = conversation.slice(this.key.length + 1)


        if (!m1) {
            botwa.sendMessage(jid, 'silakan tambahkan nama gambar terlebih dahulu')
            return
        }

        if (!m1.startsWith('/')) {
            m1 = '/' + m1
        }


        const path = await botwa.sock.downloadAndSaveMediaMessage(receivedMessage, Helper.getRandomString(20))
        const imageEntity: ImageEntity = { id: m1, path }
        ImageStorage.save(jid, imageEntity)
        botwa.sendMessage(jid, 'gambar ditambahkan')


    }
}