import { removeBackgroundFromImageFile } from "remove.bg"
import fs from 'fs'
import {exec} from 'child_process'

const pngFile = './images/OcedBot-leave-1.jpg'
const webpFile = './images/media1.webp'



run()

async function run() {
        // fs.unlinkSync(media)
        exec(`ffmpeg -i ${pngFile} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${webpFile}`, async (err) => {
            // fs.unlinkSync(pngFile)
            if (err) return console.log(err)
            // fs.unlinkSync(webpFile)
        })
}
