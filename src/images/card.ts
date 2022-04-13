import Jimp from 'jimp';

interface ImageProcess {
    type: "image" | "text"
    data: Buffer | string
    w?: number
    h?: number
    x: number
    y: number
}

export class Card {
    private _bg: Promise<Jimp>
    private pQueue: ImageProcess[] = []

    constructor(bg: Buffer) {
        this._bg = Jimp.read(bg)
    }

    private async processOverlayImage(img: Jimp, w: number, h: number, x: number, y: number) {
        const background = await this._bg
        img.circle().resize(w, h)
        background.composite(img, x, y, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 1
        })

        this._bg = (async () => background)()
    }

    private async processOverlayText(text: string, x: number, y: number) {
        const background = await this._bg
        const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE)
        background.print(font, x, y, text)
        this._bg = (async () => background)()
    }

    addImage(img: Buffer, w: number, h: number, x: number, y: number): this {
        this.pQueue.push({ data: img, type: 'image', w, h, x, y })
        return this
    }

    addText(text: string, x: number, y: number): this {
        this.pQueue.push({ data: text, type: 'text', x, y })
        return this
    }

    async getBufferAsync(): Promise<Buffer> {
        for (const q of this.pQueue) {
            if (q.type === 'image') await this.processOverlayImage(await Jimp.read(q.data as Buffer), q.w!, q.h!, q.x, q.y)
            if (q.type === 'text') await this.processOverlayText(q.data as string, q.x, q.y)
        }

        return (await this._bg).resize(1200, Jimp.AUTO).quality(40).getBufferAsync(Jimp.MIME_JPEG)
    }
}
