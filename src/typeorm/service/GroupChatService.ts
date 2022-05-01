
import { Repository } from 'typeorm'
import { BotLevel } from '../../groups/interface'
import { futureDateFromNow } from '../../utils'
import { GroupChatEntity } from '../entity/GroupChatEntity'
import { KVF } from 'kvfiledb';


export class GroupChatService {
    private repo: Repository<GroupChatEntity>
    cache: KVF;

    constructor(repo: Repository<GroupChatEntity>) {
        this.repo = repo
        this.cache = new KVF('_gcservice_')
    }

    async findAll() {
        return this.repo.find()
    }

    async findOneByJid(jid: string): Promise<GroupChatEntity | null> {
        const cache = this.cache.get(jid)
        if (cache) return cache

        const found = await this.repo.findOne({ where: { jid } })
        setImmediate(() => this.cache.set(jid, found, 1 * 3600 * 1000))
        return found
    }

    async create(jid: string) {
        const groupChat = this.repo.create({
            jid,
        })

        return this.repo.save(groupChat)
    }

    async trial(jid: string) {
        const found = await this.findOneByJid(jid)
        found!.botLevel = BotLevel.ELEGANT
        found!.trialExpiredAt = futureDateFromNow(1)

        this.cache.clear(jid)
        return this.repo.save(found!)
    }

    async sewa(jid: string, botLevel: BotLevel) {
        const found = await this.findOneByJid(jid)
        found!.botLevel = botLevel
        found!.sewaExpiredAt = futureDateFromNow(30)

        this.cache.clear(jid)
        return this.repo.save(found!)
    }

    async blacklist(jid: string) {
        const found = await this.findOneByJid(jid)
        found!.blacklist = true

        this.cache.clear(jid)
        return this.repo.save(found!)
    }


    async setWelcome(jid: string, welcome: string) {
        const found = await this.findOneByJid(jid)
        found!.welcome = welcome

        this.cache.clear(jid)
        return this.repo.save(found!)
    }

    async setLeave(jid: string, leave: string) {
        const found = await this.findOneByJid(jid)
        found!.leave = leave

        this.cache.clear(jid)
        return this.repo.save(found!)
    }

    async remove(jid: string) {
        const found = await this.findOneByJid(jid)
        if (found) {
            this.cache.clear(jid)
            return this.repo.remove(found)
        }
    }

}