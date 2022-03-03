import Jimp from 'jimp';


export class Card {
    _backgroundPath: string;
    _watermarkPath: Buffer;
    constructor(backgroundPath: string, watermarkPath: Buffer) {
        this._backgroundPath = backgroundPath
        this._watermarkPath = watermarkPath
    }

    /**
     * 
     * @param outputPath relative to opened shell pwd
     */
    async make(): Promise<Buffer> {
        const background = await Jimp.read(this._backgroundPath)
        const watermark = await Jimp.read(this._watermarkPath)
        watermark.circle().resize(1600, Jimp.AUTO)
        background.composite(watermark, 2000, 200, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 1
        })

        background.resize(2000, Jimp.AUTO)

        return await background.getBufferAsync(Jimp.MIME_JPEG)
    }
}
