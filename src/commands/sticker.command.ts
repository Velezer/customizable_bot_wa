import { Mimetype, proto } from "@adiwajshing/baileys";
import { BotWa } from "../botwa";
import { GroupChat } from "../groups/group.chat";
import { BotLevel } from "../groups/interface";
import { Command, CommandLevel } from "./interface";
import { exec } from 'child_process'
import fs from 'fs'

export class StickerCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/sticker';
    example: string = '/sticker';
    description: string = 'membuat sticker';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string, quotedMessage: proto.IMessage, receivedMessage: proto.WebMessageInfo): Promise<void> {
        const jid = groupChat.jid
        let jpegFile = './src/images/media.jpeg'
        const webpFile = './src/images/media1.webp'
        if (quotedMessage) {
            const m = await botwa.sock.loadMessage(jid, receivedMessage.message?.extendedTextMessage?.contextInfo?.stanzaId!!)
            jpegFile = await botwa.sock.downloadAndSaveMediaMessage(m, jpegFile, false)
        } else if (receivedMessage.message?.imageMessage) {
            jpegFile = await botwa.sock.downloadAndSaveMediaMessage(receivedMessage, jpegFile, false)
        }


        exec(`ffmpeg -i ${jpegFile} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${webpFile}`, async (err) => {
            console.log('exec sticker')
            if (err) return console.log(err)
            await botwa.sendSticker(jid, fs.readFileSync(webpFile))
            fs.unlinkSync(jpegFile)
            fs.unlinkSync(webpFile)
        })

    }
}
