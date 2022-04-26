import Jimp from 'jimp';
import { Card } from './card';
import fs from 'fs'


export class GroupGreetingCard extends Card {
    constructor(type: 'welcome' | 'leave') {
        let bg: string = type === 'welcome' ? './storage/group-action-cards/OcedBot-Welcome-2.jpg' : './storage/group-action-cards/OcedBot-Leave-2.jpg'
        super(fs.readFileSync(bg))
    }

    addPP(pp: Buffer): this {
        this.addImage(pp, 1070, Jimp.AUTO, 2250, 80)
        return this
    }
    addGroupIcon(icon: Buffer): this {
        this.addImage(icon, 360, Jimp.AUTO, 285, 925)
        return this
    }
    addGroupTitle(text: string): this {
        this.addText(text, 700, 1030)
        return this
    }
}
