import { BotLevel } from "../groups/interface";
import { Command, CommandLevel, RunArgs } from "./interface";
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

    async run(args: RunArgs) {
        const { botwa, groupChat, services, quotedMessage, conversation } = args
        const m1 = conversation.slice(this.key.length + 1)
        const jid = groupChat!.jid
        const url = m1

        if (!YTDownloader.validateUrl(url)) return botwa.sendText(jid, "link apaan nih? ga valid")
        botwa.sendText(jid, 'loading... sedang memproses video')

        const info = await YTDownloader.getInfo(url).catch(err => console.log(err))
        const videoDuration = +info!.videoDetails.lengthSeconds
        const durationPerVideo = 30

        const downloadedName = Helper.getRandomString(10) + '.mp4'
        // const stream = YTDownloader.downloadFromInfo(info!)
        const stream = YTDownloader.download(url)
        stream.pipe(fs.createWriteStream(downloadedName))


        stream.on('end', () => {
            this.cutVideo(fs.createReadStream(downloadedName), videoDuration, durationPerVideo,
                (output: string) => {
                    botwa.sendVideoDocument(jid, fs.readFileSync(output), output)
                        .then(() => {
                            fs.unlinkSync(output)
                        })
                },
                (err: any) => {
                    console.log('error: ', err)
                    botwa.sendText(jid, 'error bos')
                })
            setTimeout(() => {
                fs.unlinkSync(downloadedName)
            }, 10 * 60 * 1000);
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

    // async cutVideoPromise(stream: any, videoDuration: number, durationPerVideo: number): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         this.cutVideo(stream, videoDuration, durationPerVideo, resolve, reject)
    //     })
    // }
}
