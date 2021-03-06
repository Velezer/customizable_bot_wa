
import { Repository } from 'typeorm';
import { GroupMenuEntity, GroupMenuType } from '../entity/GroupMenuEntity';
import { GroupChatEntity } from '../entity/GroupChatEntity';
import { ImageStorageEntity } from '../entity/ImageEntity';
import { KVF } from 'kvfiledb';


export class GroupMenuService {
    private repo: Repository<GroupMenuEntity>;
    cache: KVF;

    constructor(repo: Repository<GroupMenuEntity>) {
        this.repo = repo
        this.cache = new KVF('_gmservice_')
    }

    async findAllMenu(jid: string): Promise<GroupMenuEntity[]> {
        const cache = this.cache.get(jid)
        if (cache) return cache

        const founds = await this.repo.findBy({ groupChat: { jid } })

        setImmediate(() => this.cache.set(jid, founds, 1 * 3600 * 1000))

        return founds
    }

    async findOneMenu(jid: string, key: string): Promise<GroupMenuEntity | null> {
        const cache = this.cache.get(jid + key) as GroupMenuEntity
        if (cache) return cache

        const found = await this.repo.findOne(
            {
                where: { groupChat: { jid }, key },
                relations: { imageStorage: true }
            })

        setImmediate(() => this.cache.set(jid + key, found, 1 * 3600 * 1000))

        return found
    }

    async createMenu(groupChat: GroupChatEntity, key: string, value: string, type: GroupMenuType, imageStorage?: ImageStorageEntity) {
        const found = await this.findOneMenu(groupChat.jid, key)
        if (!found) {
            this.cache.clear(groupChat.jid)
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
            found.value = value
            this.cache.clear(jid + key)
            return this.repo.save(found)
        }
    }

    async removeOneMenu(jid: string, key: string) {
        const found = await this.findOneMenu(jid, key)
        if (found) {
            this.cache.clear(jid + key)
            this.cache.clear(jid)
            return this.repo.remove(found)
        }
    }

}