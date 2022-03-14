import { Mimetype, proto } from "@adiwajshing/baileys";
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

        const info = await YTDownloader.getInfo(url).catch(err => console.log(err))
        const videoDuration = +info!.videoDetails.lengthSeconds
        const stream = YTDownloader.downloadFromInfo(info!)

        const filename = Helper.getRandomString(10)
        let startTime = 0
        const durationPerVideo = 30
        for (let i = 0; i < videoDuration / durationPerVideo; i++) {
            const output = i + '-' + filename + '.mp4'
            ffmpeg(stream)
                .setStartTime(startTime)
                .setDuration(durationPerVideo)
                .output(output)
                .on('end', async (err) => {
                    if (!err) {
                        await botwa.sendVideo(jid, fs.readFileSync(output))
                            .then(() => {
                                fs.unlinkSync(output)
                            })
                    }
                })
                .on('error', async (err) => {
                    console.log('error: ', err)
                    await botwa.sendText(jid, 'gagal boss')
                })
                .run()
            startTime += durationPerVideo
        }
    }
}
