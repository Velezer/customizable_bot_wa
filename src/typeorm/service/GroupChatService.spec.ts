import { delay } from "@adiwajshing/baileys";
import { BotLevel } from "../../groups/interface"
import { futureDateFromNow } from "../../utils";
import { TestDatabase } from "../test"

const testDatabase = new TestDatabase()
const { serviceGroupChat } = testDatabase.getServices()
const service = serviceGroupChat
beforeAll(async () => {
    await testDatabase.setup()
})

afterAll(async () => {
    await testDatabase.down()
    service.cache.clearAll()
})

describe('GroupChat with jid=jid', () => {
    const jid = 'jid-gc'
    it('create GroupChat', async () => {
        await service.create(jid)

        const found = await service.findOneByJid(jid)
        expect(found!.jid).toBe(jid)
        expect(found!.blacklist).toBe(false)
        expect(found!.botLevel).toBe(BotLevel.BASIC)
        expect(found!.trialExpiredAt).toBe(null)
        expect(found!.sewaExpiredAt).toBe(null)
        expect(found!.welcome).toBe(null)
        expect(found!.leave).toBe(null)
    })
    it('found all', async () => {
        const founds = await service.findAll()
        expect(founds.length).toBe(1)
    })
    it('error duplicate unique jid GroupChat', async () => {
        try {
            await service.create(jid)
        } catch (err) {
            if (err instanceof Error) {
                expect(err.message.toLowerCase()).toContain('unique')
            }
        }
    })

    it('trial GroupChat', async () => {
        await service.trial(jid)

        await delay(0)
        const found = await service.findOneByJid(jid)
        expect(found!.jid).toBe(jid)
        expect(found!.botLevel).toBe(BotLevel.ELEGANT)
        expect(found!.trialExpiredAt.getDate()).toBe(futureDateFromNow(1).getDate())
    })

    it('sewa GroupChat', async () => {
        const before = await service.findOneByJid(jid)
        expect(before!.sewaExpiredAt).toBe(null)

        await service.sewa(jid, BotLevel.BASIC)
        
        await delay(0)
        const found = await service.findOneByJid(jid)
        expect(found!.jid).toBe(jid)
        expect(found!.botLevel).toBe(BotLevel.BASIC)
        expect(found!.sewaExpiredAt.getDate()).toBe(futureDateFromNow(30).getDate())
        await delay(0)
        const cached = await service.findOneByJid(jid)
        expect(cached!.jid).toBe(jid)
        expect(cached!.botLevel).toBe(BotLevel.BASIC)
        expect(cached!.sewaExpiredAt.getDate()).toBe(futureDateFromNow(30).getDate())
        
        await service.sewa(jid, BotLevel.ELEGANT)
        await service.findOneByJid(jid)
        const sewaAgain = await service.findOneByJid(jid)
        expect(sewaAgain!.jid).toBe(jid)
        expect(sewaAgain!.botLevel).toBe(BotLevel.ELEGANT)
        expect(sewaAgain!.sewaExpiredAt.getDate()).toBe(futureDateFromNow(30).getDate())

    })
    it('setWelcome GroupChat', async () => {
        const welcome = 'welcome comrades'
        await service.setWelcome(jid, welcome)

        await delay(0)
        const found = await service.findOneByJid(jid)
        expect(found!.jid).toBe(jid)
        expect(found!.welcome).toBe(welcome)
    })
    it('setLeave GroupChat', async () => {
        const leave = 'leave comrades'
        await service.setLeave(jid, leave)

        await delay(0)
        const found = await service.findOneByJid(jid)
        expect(found!.leave).toBe(leave)
    })
    it('blacklist GroupChat', async () => {
        await service.blacklist(jid)
        
        await delay(0)
        const found = await service.findOneByJid(jid)
        expect(found!.jid).toBe(jid)
        expect(found!.blacklist).toBe(true)
    })

    it('remove GroupChat', async () => {
        const res = await service.remove(jid)
        expect(res?.jid).toBe(jid)

        await delay(0)
        const found = await service.findOneByJid(jid)
        expect(found).toBeNull
    })
})



