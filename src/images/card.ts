import Jimp from 'jimp';


export class Card {
    _backgroundPath: string;
    constructor(backgroundPath: string,) {
        this._backgroundPath = backgroundPath
    }


    async make(watermarkPath: Buffer): Promise<Buffer> {
        const background = await Jimp.read(this._backgroundPath)
        const watermark = await Jimp.read(watermarkPath)
        watermark.circle().resize(1200, Jimp.AUTO)
        background.composite(watermark, 2000, 50, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 1
        })

        return await background.resize(1600, Jimp.AUTO).quality(40).getBufferAsync(Jimp.MIME_JPEG)
    }

    async getBuffer(): Promise<Buffer> {
        const background = await Jimp.read(this._backgroundPath)
        return await background.resize(1600, Jimp.AUTO).quality(40).getBufferAsync(Jimp.MIME_JPEG)
    }
}
