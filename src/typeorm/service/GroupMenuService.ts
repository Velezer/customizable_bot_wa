
import { Repository } from 'typeorm';
import { GroupMenuEntity, GroupMenuType } from '../entity/GroupMenuEntity';
import { GroupChatEntity } from '../entity/GroupChatEntity';
import { ImageStorageEntity } from '../entity/ImageEntity';
import { FileCacheService } from './FileCacheService';


export class GroupMenuService {
    private repo: Repository<GroupMenuEntity>;
    private cache: FileCacheService;
    constructor(repo: Repository<GroupMenuEntity>, cache: FileCacheService) {
        this.repo = repo
        this.cache = cache
    }

    async findAllMenu(jid: string): Promise<GroupMenuEntity[]> {
        const cache = this.cache.get("findallmenu" + jid)
        if (cache) return cache

        const founds = await this.repo.findBy({ groupChat: { jid } })
        this.cache.set("findallmenu" + jid, founds, 1000)
        return founds
    }

    async findOneMenu(jid: string, key: string) {
        const found = await this.repo.findOne(
            {
                where: { groupChat: { jid }, key },
                relations: { imageStorage: true }
            })
        return found
    }

    async createMenu(groupChat: GroupChatEntity, key: string, value: string, type: GroupMenuType, imageStorage?: ImageStorageEntity) {
        const found = await this.findOneMenu(groupChat.jid, key)
        if (!found) {
            const groupMenu = this.repo.create({
                groupChat,
                key,
                value,
                type,
                imageStorage
            })

            return await this.repo.save(groupMenu)
        }
    }
    async createMenuText(groupChat: GroupChatEntity, key: string, value: string) {
        return this.createMenu(groupChat, key, value, GroupMenuType.TEXT)
    }
    async createMenuImage(groupChat: GroupChatEntity, key: string, value: string) {
        return this.createMenu(groupChat, key, value, GroupMenuType.IMAGE)
    }

    async createMenuStoreImage(groupChat: GroupChatEntity, key: string, imageStorage: ImageStorageEntity) {
        return this.createMenu(groupChat, key, '', GroupMenuType.IMAGE, imageStorage)
    }

    async updateMenuValue(jid: string, key: string, value: string) {
        const found = await this.findOneMenu(jid, key)
        if (found) {
            found.value = value
            return await this.repo.save(found)
        }
    }

    async removeAllMenu(jid: string) {
        const founds = await this.findAllMenu(jid)

        this.cache.clearAll()
        return this.repo.remove(founds)
    }

    async removeOneMenu(jid: string, key: string) {
        const found = await this.findOneMenu(jid, key)
        if (found) {
            return this.repo.remove(found)
        }
    }

}