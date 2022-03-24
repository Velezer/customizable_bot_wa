import { TestDatabase } from "../test"

const testDatabase = new TestDatabase()
const { serviceGroupChat: service } = testDatabase.getServices()

beforeAll(async () => {
    await testDatabase.setup()
})

afterAll(async () => {
    await testDatabase.down()
})

async function sleep(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

describe('Cache GroupChat with jid=jid', () => {
    const jid = 'jid'
    const welcome = 'welcome'

    it('cached', async () => {
        await service.create(jid)
        let found = await service.findOneByJidCached(jid)
        expect(found?.jid).toBe(jid)
        expect(found?.blacklist).toBe(false)
        expect(found?.welcome).toBe(null)

        await service.blacklist(jid)
        await service.setWelcome(jid, welcome)

        found = await service.findOneByJidCached(jid)
        expect(found?.blacklist).toBe(false)
        expect(found?.welcome).toBe(null)

        await sleep(2 * 1000)
        
        found = await service.findOneByJidCached(jid)
        expect(found?.blacklist).toBe(true)
        expect(found?.welcome).toBe(welcome)

    })


})



