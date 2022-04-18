
import { Repository } from 'typeorm'
import { BotLevel } from '../../groups/interface'
import { GroupChatEntity } from '../entity/GroupChatEntity'
import { futureDateFromNow } from '../helper/futureDate'
import { FileCacheService } from './FileCacheService'



export class GroupChatService {
    repo: Repository<GroupChatEntity>
    private cache: FileCacheService
    constructor(repo: Repository<GroupChatEntity>, cache: FileCacheService) {
        this.repo = repo
        this.cache = cache
    }

    async findOneByJid(jid: string) {
        const cache = this.cache.get("findOneByJid" + jid)
        if (cache) return cache

        const found = await this.repo.findOneBy({ jid })
        this.cache.set("findOneByJid" + jid, found, 1000)
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
        found!.botLevel = BotLevel.ELEGANT
        found!.trialExpiredAt = futureDateFromNow(1)

        return await this.repo.save(found!)
    }

    async sewa(jid: string, botLevel: BotLevel) {
        const found = await this.findOneByJid(jid)
        found!.botLevel = botLevel
        found!.sewaExpiredAt = futureDateFromNow(30)

        return await this.repo.save(found!)
    }

    async blacklist(jid: string) {
        const found = await this.findOneByJid(jid)
        found!.blacklist = true

        return await this.repo.save(found!)
    }


    async setWelcome(jid: string, welcome: string) {
        const found = await this.findOneByJid(jid)
        found!.welcome = welcome

        return await this.repo.save(found!)
    }
    
    async setLeave(jid: string, leave: string) {
        const found = await this.findOneByJid(jid)
        found!.leave = leave

        this.cache.clearAll()
        return await this.repo.save(found!)
    }

    async remove(jid: string) {
        return this.repo.delete({ jid })
    }

}