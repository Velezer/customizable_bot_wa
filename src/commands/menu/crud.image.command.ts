import { BotLevel, ImageEntity } from "../../groups/interface";
import { Helper } from "../../helper/helper";
import { Command, CommandLevel, RunArgs } from "../interface";


export class AddImageMenuCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/add-image';
    example: string = '/add-image nama-gambar';
    description: string = 'menambahkan gambar';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat,services } = args
        const jid = groupChat.jid
        if (!receivedMessage?.message?.imageMessage) {
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
        services.serviceGroupMenu.createMenuImage(groupChat, m1, path)
        botwa.sendMessage(jid, 'gambar ditambahkan')


    }
}