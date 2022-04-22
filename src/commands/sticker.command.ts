import { BotLevel } from "../groups/interface";
import { Command, CommandLevel, RunArgs } from "./interface";
import { exec } from 'child_process'
import fs from 'fs'
import { Helper } from "../helper/helper";
import Jimp from 'jimp';

export class StickerCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/sticker';
    example: string = '/sticker';
    description: string = 'membuat sticker';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(args: RunArgs): Promise<void> {
        const { botwa, groupChat, services, quotedMessage, receivedMessage } = args
        const jid = groupChat!.jid
        let jpegFile = './storage/' + Helper.getRandomString(20) + '.jpeg'
        let webpFile = './storage/' + Helper.getRandomString(20) + '.webp'
        if (Helper.isExist(jpegFile)) fs.unlinkSync(jpegFile)
        if (Helper.isExist(webpFile)) fs.unlinkSync(webpFile)

        let buffer: Buffer = Buffer.from([])
        if (quotedMessage) {
            buffer = await botwa.downloadContentFromImgMsg(quotedMessage.imageMessage!)
        } else if (receivedMessage?.message?.imageMessage) {
            buffer = await botwa.downloadContentFromImgMsg(receivedMessage.message.imageMessage)
        }

        fs.writeFileSync(jpegFile, buffer)
        const raw = await Jimp.read(jpegFile)
        const h = raw.getHeight()
        const w = raw.getWidth()

        const h512 = Math.round(h * 512 / w)
        const w512 = Math.round(w * 512 / h)

        exec(`ffmpeg -i ${jpegFile} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s ${w512.toString()}:${h512.toString()} ${webpFile}`, async (err) => {
            fs.unlinkSync(jpegFile)
            if (err) return console.log(err)
            await botwa.sendSticker(jid, fs.readFileSync(webpFile))
            fs.unlinkSync(webpFile)
        })

    }
}
