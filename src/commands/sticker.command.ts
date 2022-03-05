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
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string, quotedMessage: proto.IMessage, receivedMessage: proto.WebMessageInfo): Promise<void> {
        if (quotedMessage) return console.log('quotedMessage not supported')
        if (receivedMessage.message?.imageMessage) {
            console.log('/sticker invoked')
            console.log(receivedMessage)
            const jid = groupChat.jid
            const jpegFile = './images/media.jpeg'
            const webpFile = './images/media1.webp'

            console.log('------------------')
            
            // const buffer: Buffer = await botwa.getBufferFromUrl(receivedMessage.message?.imageMessage?.url!)
            // fs.writeFileSync(jpegFile, buffer)
            const media = await botwa.sock.downloadAndSaveMediaMessage(receivedMessage, jpegFile, false)
            console.log(media)
        }


        // console.log(fs.readFileSync(jpegFile))
        // exec(`ffmpeg -i ${media} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${webpFile}`, async (err) => {
        //     console.log('exec sticker')
        //     if (err) return console.log(err)
        //     // await botwa.sendSticker(jid, fs.readFileSync(webpFile))
        //     // fs.unlinkSync(jpegFile)
        //     // fs.unlinkSync(webpFile)
        // })

    }
}
