
import { Repository } from 'typeorm';
import { GroupMenuEntity, GroupMenuType } from '../entity/GroupMenu';


export class GroupMenuService {
    private repo: Repository<GroupMenuEntity>;
    constructor(repo: Repository<GroupMenuEntity>) {
        this.repo = repo
    }

    async findAllMenu(jid: string): Promise<GroupMenuEntity[]> {
        const founds = await this.repo.findBy({ jid })
        if (!founds) {
            throw new Error(`${jid} not found`)
        }

        return founds
    }

    async findOneMenu(jid: string, key: string) {
        const found = await this.repo.findOneBy({ jid, key })
        if (!found) {
            throw new Error(`${key} not found in ${jid}`)
        }
        return found
    }

    async createMenu(jid: string, key: string, value: string, type: GroupMenuType) {
        const groupMenu = this.repo.create({
            jid,
            key,
            value,
            type
        })

        try {
            await this.repo.save(groupMenu)
        } catch (err) {
            console.log(err)
        }
    }

    async updateMenu(jid: string, key: string, value: string) {
        const found = await this.findOneMenu(jid, key)
        found.value = value
        try {
            await this.repo.save(found)
        } catch (err) {
            console.log(err)
        }
    }

    async removeAllMenu(jid: string) {
        const founds = await this.findAllMenu(jid)
        return this.repo.remove(founds)
    }

    async removeOneMenu(jid: string, key: string) {
        const found = await this.findOneMenu(jid, key)
        return this.repo.remove(found)
    }

}