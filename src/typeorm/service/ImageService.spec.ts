import { GroupMenuType } from '../entity/GroupMenuEntity';
import { TestDatabase } from '../test/index';

const testDatabase = new TestDatabase()
const { serviceGroupChat, serviceGroupMenu: serviceMenu, imageStorageService: storage } = testDatabase.getServices()

beforeAll(async () => {
    await testDatabase.setup()
})

afterAll(async () => {
    await testDatabase.down()
    serviceMenu.cache.clearAll()
})

describe('image service', () => {
    const buffer: Uint8Array = new Uint8Array([1, 2, 3, 4, 5])
    const bufferUpdated: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 5, 6, 6, 2])
    it('store image', async () => {
        const ent = await storage.store(buffer)
        expect(ent.id).toBe(1)
        expect(ent.image).toBe(buffer)
    })
    it('found', async () => {
        const found = await storage.findOne(1)
        expect(found!.image).toStrictEqual(Buffer.from(buffer))
    })
    it('update', async () => {
        const found = await storage.updateOne(1, bufferUpdated)
        expect(found!.image).toBe(bufferUpdated)
    })
    it('remove', async () => {
        const found = await storage.removeOne(1)
        expect(found.affected).toBe(1)
    })
})

describe('image menu service', () => {
    const jid = 'jidmenustore'
    const key = '/keyyymenustore'
    const buffer = [1, 2, 3, 4, 5, 34, 2]
    it('store image menu', async () => {
        const gc = await serviceGroupChat.create(jid)
        const img = await storage.store(Buffer.from(buffer))
        await serviceMenu.createMenuStoreImage(gc, key, img)

        await serviceMenu.findOneMenu(jid, key) // cache first
        const found = await serviceMenu.findOneMenu(jid, key) // get from cache
        expect(found!.type).toEqual(GroupMenuType.IMAGE)
        expect(found!.imageStorage.image).toEqual(Buffer.from(buffer))
    })
})


