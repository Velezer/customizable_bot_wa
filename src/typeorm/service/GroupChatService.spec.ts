import { delay } from "@adiwajshing/baileys";
import { QueryFailedError } from "typeorm";
import { BotLevel } from "../../groups/interface"
import { futureDateFromNow } from '../helper/futureDate';
import { TestDatabase } from "../test"

const testDatabase = new TestDatabase()
const { serviceGroupChat } = testDatabase.getServices()
const service = serviceGroupChat
beforeAll(async () => {
    await testDatabase.setup()
})

afterAll(async () => {
    await testDatabase.down()
})

describe('GroupChat with jid=jid', () => {
    const jid = 'jid-gc'
    it('create GroupChat', async () => {
        const res = await service.create(jid)
        expect(res.jid).toBe(jid)
        expect(res.blacklist).toBe(false)
        expect(res.botLevel).toBe(BotLevel.BASIC)
        expect(res.trialExpiredAt).toBe(null)
        expect(res.sewaExpiredAt).toBe(null)
        expect(res.welcome).toBe(null)
        expect(res.leave).toBe(null)
    })
    it('found all', async () => {
        const founds = await service.findAll()
        expect(founds.length).toBe(1)
    })
    it('found one by jid', async () => {
        const found = await service.findOneByJid(jid)
        expect(found!.jid).toBe(jid)
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
        const res = await service.trial(jid)
        expect(res.jid).toBe(jid)
        expect(res.botLevel).toBe(BotLevel.ELEGANT)
        expect(res.trialExpiredAt.getDate()).toBe(futureDateFromNow(1).getDate())

        await delay(0)
        const found = await service.findOneByJid(jid)
        expect(found!.trialExpiredAt).toBeTruthy()
    })

    it('sewa GroupChat', async () => {
        const res = await service.sewa(jid, BotLevel.BASIC)
        expect(res.jid).toBe(jid)
        expect(res.blacklist).toBe(false)
        expect(res.botLevel).toBe(BotLevel.BASIC)
        expect(res.sewaExpiredAt.getDate()).toBe(futureDateFromNow(30).getDate())
        await delay(0)
        const found = await service.findOneByJid(jid)
        expect(found!.sewaExpiredAt).toBeTruthy()
    })
    it('setWelcome GroupChat', async () => {
        const welcome = 'welcome comrades'
        const res = await service.setWelcome(jid, welcome)
        expect(res.jid).toBe(jid)
        expect(res.welcome).toBe(welcome)

        await delay(0)
        const found = await service.findOneByJid(jid)
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
        const res = await service.blacklist(jid)
        expect(res.jid).toBe(jid)
        expect(res.blacklist).toBe(true)

        await delay(0)
        const found = await service.findOneByJid(jid)
        expect(found?.blacklist).toBe(true)
    })

    it('remove GroupChat', async () => {
        const res = await service.remove(jid)
        expect(res?.jid).toBe(jid)

        await delay(0)
        const found = await service.findOneByJid(jid)
        expect(found).toBeNull
    })
})



