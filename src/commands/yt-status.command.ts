import { BotLevel } from "../groups/interface";
import { Command, CommandLevel, RunArgs } from "./interface";
import fs from 'fs'
import { YTDownloader } from "../video/ytdownloader";
import ffmpeg from 'fluent-ffmpeg'
import { getRandomString, retryPromise } from "../utils";



export class YTStatusCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/yt-status';
    example: string = '/yt-status link';
    description: string = 'bikin video status dari youtube';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(args: RunArgs) {
        const { botwa, groupChat, conversation } = args
        const m1 = conversation.slice(this.key.length + 1)
        const jid = groupChat!.jid
        const url = m1

        if (!YTDownloader.validateUrl(url)) return botwa.sendText(jid, "link apaan nih? ga valid")
        botwa.sendText(jid, 'loading... sedang memproses video')

        const info = await YTDownloader.getInfo(url).catch(err => console.log(err))
        const videoDuration = +info!.videoDetails.lengthSeconds
        const durationPerVideo = 30

        const downloadedName = getRandomString(10) + '.mp4'
        const stream = YTDownloader.download(url)
        stream.pipe(fs.createWriteStream(downloadedName))

        stream.on('end', () => {
            this.makeStatus(fs.createReadStream(downloadedName), videoDuration, durationPerVideo,
                (output: string) => {
                    retryPromise(() => botwa.sendVideoDocument(jid, fs.readFileSync(output), output), 40)
                        .then(() => {
                            fs.unlinkSync(output)
                        })
                },
            ).then(() => fs.unlinkSync(downloadedName))
        })

    }

    async makeStatus(stream: any, videoDuration: number, durationPerVideo: number, resolve: Function) {
        const filename = getRandomString(10)
        let startTime = 0
        for (let i = 0; i < videoDuration / durationPerVideo; i++) {
            const output = i + '-' + filename + '.mp4'
            await retryPromise(() => this.cutVideo(stream, durationPerVideo, startTime, output), 10)
                .then(output => resolve(output))
            startTime += durationPerVideo
        }
        return new Promise<void>((res) => {
            res()
        })
    }

    async cutVideo(stream: any, durationPerVideo: number, startTime: number, output: string) {
        return new Promise((resolve, reject) => {
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
        })
    }

}
