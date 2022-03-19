import ytdl from "ytdl-core"
import { Helper } from "../helper/helper"
import fs from 'fs'

export class YTDownloader {

    static validateUrl(url: string) {
        return ytdl.validateURL(url)
    }

    static async getInfo(url: string) {
        const info = await ytdl.getInfo(url)
        return info
    }

    static downloadFromInfo(info: ytdl.videoInfo) {
        const stream = ytdl.downloadFromInfo(info, { filter: format => format.container === 'mp4' })
        return stream
    }
}