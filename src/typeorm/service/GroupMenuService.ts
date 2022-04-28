
import { Repository } from 'typeorm';
import { GroupMenuEntity, GroupMenuType } from '../entity/GroupMenuEntity';
import { GroupChatEntity } from '../entity/GroupChatEntity';
import { ImageStorageEntity } from '../entity/ImageEntity';


export class GroupMenuService {
    private repo: Repository<GroupMenuEntity>;

    constructor(repo: Repository<GroupMenuEntity>) {
        this.repo = repo
    }

    async findAllMenu(jid: string): Promise<GroupMenuEntity[]> {
        const founds = await this.repo.findBy({ groupChat: { jid } })
        return founds
    }

    async findOneMenu(jid: string, key: string): Promise<GroupMenuEntity | null> {
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
            return this.repo.save(found)
        }
    }

    async removeOneMenu(jid: string, key: string) {
        const found = await this.findOneMenu(jid, key)
        if (found) {
            return this.repo.remove(found)
        }
    }

}