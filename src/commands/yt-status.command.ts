import { proto } from "@adiwajshing/baileys";
import { BotWa } from "../botwa";
import { GroupChat } from "../groups/group.chat";
import { BotLevel } from "../groups/interface";
import { Command, CommandLevel } from "./interface";
import fs from 'fs'
import { Helper } from "../helper/helper";
import { YTDownloader } from "../video/ytdownloader";
import ffmpeg from 'fluent-ffmpeg'

export class YTStatusCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/yt-status';
    example: string = '/yt-status link';
    description: string = 'bikin video status dari youtube';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string, quotedMessage: proto.IMessage, receivedMessage: proto.WebMessageInfo) {
        const m1 = conversation.slice(this.key.length + 1)
        const jid = groupChat.jid
        const url = m1

        if (!YTDownloader.validateUrl(url)) return botwa.sendText(jid, "link apaan nih? ga valid")
        botwa.sendText(jid, 'loading... sedang memproses video')

        const info = await YTDownloader.getInfo(url).catch(err => console.log(err))
        const videoDuration = +info!.videoDetails.lengthSeconds
        const stream = YTDownloader.downloadFromInfo(info!)

        const durationPerVideo = 30

        stream.on('end', () => {
            this.cutVideo(stream, videoDuration, durationPerVideo,
                (output: string) => {
                    botwa.sendText(jid, "loading... sedang mengirim " + output)
                    botwa.sendVideoDocument(jid, fs.readFileSync(output), output)
                        .then(() => {
                            fs.unlinkSync(output)
                        })
                },
                (err: any) => {
                    console.log('error: ', err)
                    botwa.sendText(jid, 'error bos')
                })
        })

    }

    async cutVideo(stream: any, videoDuration: number, durationPerVideo: number, resolve: Function, reject: Function) {
        const filename = Helper.getRandomString(10)
        let startTime = 0
        for (let i = 0; i < videoDuration / durationPerVideo; i++) {
            const output = i + '-' + filename + '.mp4'
            ffmpeg(stream)
                .setStartTime(startTime)
                .setDuration(durationPerVideo)
                .output(output)
                .on('end', async (err) => {
                    if (!err) {
                        resolve(output)
                    }
                })
                .on('error', async (err) => {
                    reject(err)
                })
                .run()
            startTime += durationPerVideo
        }
    }

    async cutVideoPromise(stream: any, videoDuration: number, durationPerVideo: number): Promise<string> {
        return new Promise((resolve, reject) => {
            this.cutVideo(stream, videoDuration, durationPerVideo, resolve, reject)
        })
    }
}
