import { TestDatabase } from "../test"

const testDatabase = new TestDatabase()
const { authService: service } = testDatabase.getServices()

beforeAll(async () => {
    await testDatabase.setup()
})

afterAll(async () => {
    await testDatabase.down()
})

describe('GroupChat with jid=jid', () => {
    const name = 'botwa'
    const authInfo = 'authinfo'
    it('create auth', async () => {
        const res = await service.create(name, authInfo)
        expect(res.name).toBe(name)
        expect(res.authInfo).toBe(authInfo)
    })
    it('error duplicate unique auth name', async () => {
        try {
            const res = await service.create(name, authInfo)
        } catch (err) {
            if (err instanceof Error) {
                expect(err.message.toLowerCase()).toContain('unique')
            }
        }
    })

    it('findOne auth', async ()=>{
        const found = await service.findOne(name)
        expect(found.name).toBe(name)
        expect(found.authInfo).toBe(authInfo)
    })


    it('remove GroupChat', async () => {
        const res = await service.remove(name)
        expect(res.affected).toBe(1)
    })

})



