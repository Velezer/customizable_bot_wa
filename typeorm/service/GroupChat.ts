
import { Repository } from 'typeorm';
import { BotLevel } from '../../src/groups/interface';
import { GroupChatEntity } from '../entity/GroupChat';

function futureDateFromNow(day: number) {
    // const now = new Date()
    // const futureDate = new Date(now)
    // futureDate.setDate(now.getDate() + day)
    // return futureDate
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + day)
    return futureDate
}

export class GroupChatService {
    private repo: Repository<GroupChatEntity>;
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

        try {
            await this.repo.save(groupChat)
        } catch (err) {
            console.log(err)
        }
    }

    async trial(jid: string) {
        const found = await this.findOneByJid(jid)
        found.botLevel = BotLevel.ELEGANT
        found.trialExpiredAt = futureDateFromNow(1)

        try {
            return await this.repo.save(found)
        } catch (err) {
            console.log(err)
        }
    }

    async sewa(jid: string, botLevel: BotLevel) {
        const found = await this.findOneByJid(jid)
        found.botLevel = botLevel
        found.sewaExpiredAt = futureDateFromNow(30)

        try {
            return await this.repo.save(found)
        } catch (err) {
            console.log(err)
        }
    }

    async blacklist(jid: string) {
        const found = await this.findOneByJid(jid)
        found.blacklist = true

        try {
            return await this.repo.save(found)
        } catch (err) {
            console.log(err)
        }
    }

    async remove(jid: string) {
        const found = await this.findOneByJid(jid)
        return this.repo.remove(found)
    }

}