import { Mimetype, proto } from "@adiwajshing/baileys";
import Jimp from "jimp";
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
        console.log('/sticker invoked')
        const jid = groupChat.jid
        const jpegFile = './storage/media.jpeg'
        const output = './storage/media1.webp'
        const media = await botwa.sock.downloadAndSaveMediaMessage(receivedMessage, jpegFile)
        
        exec(`ffmpeg -i ${media} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${output}`, async (err) => {
            console.log('exec sticker')
            if (err) return console.log(err)
            await botwa.sendSticker(jid, fs.readFileSync(output))
            // fs.unlinkSync(output)
        })

    }
}
