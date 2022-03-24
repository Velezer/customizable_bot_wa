
import { Repository } from 'typeorm';
import { ImageStorageEntity } from './../entity/ImageEntity';


export class ImageStorageService {
    private repo: Repository<ImageStorageEntity>;
    constructor(repo: Repository<ImageStorageEntity>) {
        this.repo = repo
    }

    async findOne(id: number) {
        const founds = await this.repo.findOneBy({ id })
        return founds
    }


    async store(image: Uint8Array) {
        const obj = this.repo.create({
            image
        })

        return await this.repo.save(obj)
    }

    async updateOne(id: number, image: Uint8Array) {
        const found = await this.findOne(id)
        if (found) {
            found.image = image
            return await this.repo.save(found)
        }
    }


    async removeOne(id: number) {
        return this.repo.delete({ id })
    }

}