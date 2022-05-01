
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
        this.cache.set(jid, found, 1 * 3600 * 1000)
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

        return this.repo.save(found!).then((res) => {
            this.cache.set(jid, found, 1 * 3600 * 1000)
            return res
        })
    }

    async sewa(jid: string, botLevel: BotLevel) {
        const found = await this.findOneByJid(jid)
        found!.botLevel = botLevel
        found!.sewaExpiredAt = futureDateFromNow(30)

        return this.repo.save(found!).then((res) => {
            this.cache.set(jid, found, 1 * 3600 * 1000)
            return res
        })
    }

    async blacklist(jid: string) {
        const found = await this.findOneByJid(jid)
        found!.blacklist = true

        return this.repo.save(found!).then((res) => {
            this.cache.set(jid, res, 1 * 3600 * 1000)
            return res
        })
    }


    async setWelcome(jid: string, welcome: string) {
        const found = await this.findOneByJid(jid)
        found!.welcome = welcome

        return this.repo.save(found!).then((res) => {
            this.cache.set(jid, res, 1 * 3600 * 1000)
            return res
        })
    }

    async setLeave(jid: string, leave: string) {
        const found = await this.findOneByJid(jid)
        found!.leave = leave

        return this.repo.save(found!).then((res) => {
            this.cache.set(jid, res, 1 * 3600 * 1000)
            return res
        })
    }

    async remove(jid: string) {
        const found = await this.findOneByJid(jid)
        if (found) {
            return this.repo.remove(found).then((res) => {
                this.cache.clear(jid)
                return res
            })
        }
    }

}