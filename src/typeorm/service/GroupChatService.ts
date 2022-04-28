
import { Repository } from 'typeorm'
import { BotLevel } from '../../groups/interface'
import { futureDateFromNow } from '../../utils'
import { GroupChatEntity } from '../entity/GroupChatEntity'


export class GroupChatService {
    repo: Repository<GroupChatEntity>

    constructor(repo: Repository<GroupChatEntity>) {
        this.repo = repo
    }

    async findAll() {
        return this.repo.find()
    }
    
    async findOneByJid(jid: string): Promise<GroupChatEntity | null> {
        const found = await this.repo.findOne({ where: { jid } })
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

        return await this.repo.save(found!)
    }

    async remove(jid: string) {
        const found = await this.findOneByJid(jid)
        if (found) {
            return this.repo.remove(found)
        }
    }

}