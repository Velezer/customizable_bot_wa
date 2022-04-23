
import { Repository } from 'typeorm';
import { GroupMenuEntity, GroupMenuType } from '../entity/GroupMenuEntity';
import { GroupChatEntity } from '../entity/GroupChatEntity';
import { ImageStorageEntity } from '../entity/ImageEntity';
import { FileCacheService } from './FileCacheService';


export class GroupMenuService {
    private repo: Repository<GroupMenuEntity>;
    private cache: FileCacheService;

    private cacheKey = {
        findAllMenu: (jid: string) => 'findAllMenu' + jid,
        findOneMenu: (jid: string) => 'findOneMenu' + jid
    }
    constructor(repo: Repository<GroupMenuEntity>, cache: FileCacheService) {
        this.repo = repo
        this.cache = cache
    }

    async findAllMenu(jid: string): Promise<GroupMenuEntity[]> {
        const cache = this.cache.get(this.cacheKey.findAllMenu(jid))
        if (cache) return cache

        const founds = await this.repo.findBy({ groupChat: { jid } })
        this.cache.set(this.cacheKey.findAllMenu(jid), founds, 30 * 60_000)
        return founds
    }

    async findOneMenu(jid: string, key: string): Promise<GroupMenuEntity | null> {
        const cache = this.cache.get(this.cacheKey.findOneMenu(jid))
        if (cache) return cache

        const found = await this.repo.findOne(
            {
                where: { groupChat: { jid }, key },
                relations: { imageStorage: true }
            })
        this.cache.set(this.cacheKey.findOneMenu(jid), found, 1_000)
        return found
    }

    async createMenu(groupChat: GroupChatEntity, key: string, value: string, type: GroupMenuType, imageStorage?: ImageStorageEntity) {
        const found = await this.findOneMenu(groupChat.jid, key)
        this.cache.clear(this.cacheKey.findOneMenu(groupChat.jid))
        if (!found) {
            this.cache.clear(this.cacheKey.findAllMenu(groupChat.jid))
            const groupMenu = this.repo.create({
                groupChat,
                key,
                value,
                type,
                imageStorage
            })

            return this.repo.save(groupMenu)
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
            this.cache.clear(this.cacheKey.findAllMenu(jid))
            this.cache.clear(this.cacheKey.findOneMenu(jid))
            found.value = value
            return this.repo.save(found)
        }
    }

    async removeOneMenu(jid: string, key: string) {
        const found = await this.findOneMenu(jid, key)
        if (found) {
            this.cache.clear(this.cacheKey.findAllMenu(jid))
            this.cache.clear(this.cacheKey.findOneMenu(jid))
            return this.repo.remove(found)
        }
    }

}