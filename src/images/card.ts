import Jimp from 'jimp';


export class Card {
    _backgroundPath: string;
    _watermarkPath: Buffer;
    constructor(backgroundPath: string, watermarkPath: Buffer) {
        this._backgroundPath = backgroundPath
        this._watermarkPath = watermarkPath
    }


    async make(): Promise<Buffer> {
        const background = await Jimp.read(this._backgroundPath)
        const watermark = await Jimp.read(this._watermarkPath)
        watermark.circle().resize(1200, Jimp.AUTO)
        background.composite(watermark, 2000, 150, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 1
        })

        return await background.resize(1600, Jimp.AUTO).quality(50).getBufferAsync(Jimp.MIME_JPEG)
    }
}
