import { Mimetype, proto } from "@adiwajshing/baileys";
import Jimp from "jimp";
import { BotWa } from "../botwa";
import { GroupChat } from "../groups/group.chat";
import { BotLevel } from "../groups/interface";
import { Command, CommandLevel } from "./interface";
import { exec } from 'child_process'
import fs from 'fs'
import { removeBackgroundFromImageFile } from "remove.bg";

export class StickerCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/sticker';
    example: string = '/sticker';
    description: string = 'membuat sticker';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string, quotedMessage: proto.IMessage, receivedMessage: proto.WebMessageInfo): Promise<void> {
        const jid = groupChat.jid
        const input = './storage/media.jpeg'
        const output = './storage/media1.webp'
        const media = await botwa.sock.downloadAndSaveMediaMessage(receivedMessage, input)
        // const jimp = await Jimp.read(img)
        // const buffer: Buffer = await jimp.getBufferAsync(Mimetype.webp)
        exec(`ffmpeg -i ${input} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${output}`, async (err) => {
            // fs.unlinkSync(input)
            if (err) return console.log(err)
            await botwa.sendSticker(jid, fs.readFileSync(output))
            // fs.unlinkSync(output)
        })

        const pngFile = './storage/media1.png'
        const webpFile = './storage/media1.webp'

        await removeBackgroundFromImageFile({ path: media, apiKey: 'bcAvZyjYAjKkp1cmK8ZgQvWH', size: 'auto', type: 'auto', outputFile: pngFile })
            .then(res => {
                // fs.unlinkSync(media)
                let buffer = Buffer.from(res.base64img, 'base64')
                fs.writeFileSync(pngFile, buffer)
                exec(`ffmpeg -i ${pngFile} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${webpFile}`, async (err) => {
                    // fs.unlinkSync(pngFile)
                    if (err) return console.log(err)
                    await botwa.sendSticker(jid, fs.readFileSync(webpFile))
                    // fs.unlinkSync(webpFile)
                })
            })
    }
}
