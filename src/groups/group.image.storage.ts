

import { Helper } from '../helper/helper'
import { GroupImageData, ImageEntity } from './interface'



export class ImageStorage {
    private static _file: string = 'group-images.json'
    private static _findAll(): GroupImageData[] {
        const data: GroupImageData[] = Helper.readJSON(this._file)
        return data
    }
    static save(groupJid: string, imageEntity: ImageEntity) {
        const data: GroupImageData[] = this._findAll()
        const hasGroupJid = data.find(d => d.groupJid === groupJid)
        if (hasGroupJid) {
            hasGroupJid.images.push(imageEntity)
        } else {
            const groupImageData: GroupImageData = { groupJid, images: [imageEntity] }
            data.push(groupImageData)
        }
        Helper.saveJSON(this._file, data)
    }
    static findImageById(groupJid: string, id: string) {
        return this.findByGroupJid(groupJid)?.images.find(img => img.id === id)
    }
    static findByGroupJid(groupJid: string) {
        const groupImages: GroupImageData[] = Helper.readJSON(this._file)
        return groupImages.find(g => g.groupJid === groupJid)
    }
}