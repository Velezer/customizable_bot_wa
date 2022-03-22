import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { BotLevel } from "../../src/groups/interface"
import { GroupChatEntity } from "../entity/GroupChat"
import { GroupMenuEntity } from "../entity/GroupMenu"
import { GroupChatService } from "./GroupChat"
import { futureDateFromNow } from './../helper/futureDate';

process.env.NODE_ENV = 'test'
const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: ":memory:",
    dropSchema: true,
    synchronize: true,
    logging: false,
    entities: [GroupChatEntity, GroupMenuEntity],
    migrations: [],
    subscribers: [],
})
const repo = new Repository(GroupChatEntity, dataSource.manager)
const service = new GroupChatService(repo)

beforeAll(async () => {
    await dataSource.initialize().catch(err => console.log(err))
})

afterAll(async () => {
    await dataSource.destroy()
})

describe('GroupChat with jid=jid', () => {
    const jid = 'jid'
    it('create GroupChat', async () => {
        const res = await service.create(jid)
        expect(res.jid).toBe(jid)
        expect(res.blacklist).toBe(false)
        expect(res.botLevel).toBe(BotLevel.BASIC)
        expect(res.trialExpiredAt).toBe(null)
        expect(res.sewaExpiredAt).toBe(null)
        expect(res.welcome).toBe(null)
    })
    it('error duplicate unique jid GroupChat', async () => {
        try {
            const res = await service.create(jid)
        } catch (err) {
            if (err instanceof Error) {
                expect(err.message.toLowerCase()).toContain('unique')
            }
        }
    })

    it('trial GroupChat', async () => {
        const res = await service.trial(jid)
        expect(res.jid).toBe(jid)
        expect(res.blacklist).toBe(false)
        expect(res.botLevel).toBe(BotLevel.ELEGANT)
        expect(res.trialExpiredAt.getDate()).toBe(futureDateFromNow(1).getDate())
        expect(res.sewaExpiredAt).toBe(null)
        expect(res.welcome).toBe(null)
    })

    it('sewa GroupChat', async () => {
        const res = await service.sewa(jid, BotLevel.BASIC)
        expect(res.jid).toBe(jid)
        expect(res.blacklist).toBe(false)
        expect(res.botLevel).toBe(BotLevel.BASIC)
        expect(res.trialExpiredAt.getDate()).toBe(futureDateFromNow(1).getDate())
        expect(res.sewaExpiredAt.getDate()).toBe(futureDateFromNow(30).getDate())
        expect(res.welcome).toBe(null)
    })
    it('setWelcome GroupChat', async () => {
        const welcome = 'welcome comrades'
        const res = await service.setWelcome(jid, welcome)
        expect(res.jid).toBe(jid)
        expect(res.blacklist).toBe(false)
        expect(res.botLevel).toBe(BotLevel.BASIC)
        expect(res.trialExpiredAt.getDate()).toBe(futureDateFromNow(1).getDate())
        expect(res.sewaExpiredAt.getDate()).toBe(futureDateFromNow(30).getDate())
        expect(res.welcome).toBe(welcome)
    })
    it('blacklist GroupChat', async () => {
        const res = await service.blacklist(jid)
        expect(res.jid).toBe(jid)
        expect(res.blacklist).toBe(true)
    })
    it('error blacklist GroupChat', async () => {
        try {
            const res = await service.findOneByJid(jid)
        } catch (err) {
            if (err instanceof Error) {
                expect(err.message).toContain('blacklist')
            }
        }
    })
    
    it('remove GroupChat', async () => {
        const res = await service.remove(jid)
        expect(res.affected).toBe(1)
    })
    it('error not found GroupChat', async () => {
        try {
            const res = await service.findOneByJid(jid)
        } catch (err) {
            if (err instanceof Error) {
                expect(err.message).toContain('not found')
            }
        }
    })


})



