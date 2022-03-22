
import { QueryFailedError, Repository } from 'typeorm'
import { BotLevel } from '../../src/groups/interface'
import { GroupChatEntity } from '../entity/GroupChatEntity'
import { GroupMenuEntity, GroupMenuType } from '../entity/GroupMenuEntity'
import { futureDateFromNow } from '../helper/futureDate'



export class GroupChatService {
    private repo: Repository<GroupChatEntity>
    constructor(repo: Repository<GroupChatEntity>) {
        this.repo = repo
    }

    async findOneByJid(jid: string): Promise<GroupChatEntity> {
        const found = await this.repo.findOneBy({ jid })
        if (!found) {
            throw new Error(`${jid} not found`)
        }

        if (found.blacklist) {
            throw new Error(`${jid} is in blacklist`)
        }

        return found
    }

    async create(jid: string) {
        const groupChat = this.repo.create({
            jid,
        })


        return await this.repo.save(groupChat)
    }

    async trial(jid: string) {
        const found = await this.findOneByJid(jid)
        found.botLevel = BotLevel.ELEGANT
        found.trialExpiredAt = futureDateFromNow(1)

        return await this.repo.save(found)
    }

    async sewa(jid: string, botLevel: BotLevel) {
        const found = await this.findOneByJid(jid)
        found.botLevel = botLevel
        found.sewaExpiredAt = futureDateFromNow(30)

        return await this.repo.save(found)
    }

    async blacklist(jid: string) {
        const found = await this.findOneByJid(jid)
        found.blacklist = true

        return await this.repo.save(found)
    }


    async setWelcome(jid: string, welcome: string) {
        const found = await this.findOneByJid(jid)
        found.welcome = welcome

        return await this.repo.save(found)
    }

    async remove(jid: string) {
        return this.repo.delete({ jid })
    }

}