
import { Repository } from 'typeorm';
import { GroupMenuEntity, GroupMenuType } from '../entity/GroupMenuEntity';
import { GroupChatEntity } from '../entity/GroupChatEntity';


export class GroupMenuService {
    private repo: Repository<GroupMenuEntity>;
    constructor(repo: Repository<GroupMenuEntity>) {
        this.repo = repo
    }

    async findAllMenu(jid: string): Promise<GroupMenuEntity[]> {
        const founds = await this.repo.findBy({ groupChat: { jid } })
        return founds
    }
    // async findAllTextMenu(jid: string): Promise<GroupMenuEntity[]> {
    //     const founds = await this.repo.findBy({ groupChat: { jid }, type: GroupMenuType.TEXT })
    //     return founds
    // }
    // async findAllImageMenu(jid: string): Promise<GroupMenuEntity[]> {
    //     const founds = await this.repo.findBy({ groupChat: { jid }, type: GroupMenuType.IMAGE })
    //     return founds
    // }

    async findOneMenu(jid: string, key: string) {
        const found = await this.repo.findOneBy({ groupChat: { jid }, key })
        return found
    }

    async createMenu(groupChat: GroupChatEntity, key: string, value: string, type: GroupMenuType) {
        const found = await this.findOneMenu(groupChat.jid, key)
        if (!found){
            const groupMenu = this.repo.create({
                groupChat,
                key,
                value,
                type
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

    async updateMenuValue(jid: string, key: string, value: string) {
        const found = await this.findOneMenu(jid, key)
        if(found){
            found.value = value
            return await this.repo.save(found)
        }
    }

    async removeAllMenu(jid: string) {
        const founds = await this.findAllMenu(jid)
        return this.repo.remove(founds)
    }

    async removeOneMenu(jid: string, key: string) {
        const found = await this.findOneMenu(jid, key)
        if (found){
            return this.repo.remove(found)
        }
    }

}