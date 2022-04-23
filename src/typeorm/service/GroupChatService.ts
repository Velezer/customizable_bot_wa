
import { Repository } from 'typeorm'
import { BotLevel } from '../../groups/interface'
import { GroupChatEntity } from '../entity/GroupChatEntity'
import { futureDateFromNow } from '../helper/futureDate'
import { FileCacheService } from './FileCacheService'



export class GroupChatService {
    repo: Repository<GroupChatEntity>
    private cache: FileCacheService

    private cacheKey = {
        findOneByJid: (jid: string) => 'findOneByJid-' + jid,
    }

    constructor(repo: Repository<GroupChatEntity>, cache: FileCacheService) {
        this.repo = repo
        this.cache = cache
    }

    async findAll() {
        return this.repo.find()
    }
    
    async findOneByJid(jid: string): Promise<GroupChatEntity | null> {
        const cache = this.cache.get(this.cacheKey.findOneByJid(jid))
        if (cache) return cache

        const found = await this.repo.findOne({ where: { jid } })
        this.cache.set(this.cacheKey.findOneByJid(jid), found, 30 * 60_000)
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

        this.cache.clear(this.cacheKey.findOneByJid(jid))
        return await this.repo.save(found!)
    }

    async sewa(jid: string, botLevel: BotLevel) {
        const found = await this.findOneByJid(jid)
        found!.botLevel = botLevel
        found!.sewaExpiredAt = futureDateFromNow(30)

        this.cache.clear(this.cacheKey.findOneByJid(jid))
        return await this.repo.save(found!)
    }

    async blacklist(jid: string) {
        const found = await this.findOneByJid(jid)
        found!.blacklist = true

        this.cache.clear(this.cacheKey.findOneByJid(jid))
        return await this.repo.save(found!)
    }


    async setWelcome(jid: string, welcome: string) {
        const found = await this.findOneByJid(jid)
        found!.welcome = welcome

        this.cache.clear(this.cacheKey.findOneByJid(jid))
        return await this.repo.save(found!)
    }

    async setLeave(jid: string, leave: string) {
        const found = await this.findOneByJid(jid)
        found!.leave = leave

        this.cache.clear(this.cacheKey.findOneByJid(jid))
        return await this.repo.save(found!)
    }

    async remove(jid: string) {
        const found = await this.findOneByJid(jid)
        if (found) {
            this.cache.clear(this.cacheKey.findOneByJid(jid))
            return this.repo.remove(found)
        }
    }

}