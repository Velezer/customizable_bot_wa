import { sleep } from "../../utils";
import { GroupMenuType } from "../entity/GroupMenuEntity"
import { TestDatabase } from '../test/index';

const testDatabase = new TestDatabase()
const { serviceGroupMenu, serviceGroupChat } = testDatabase.getServices()
const jid = 'jidmenu'

beforeAll(async () => {
    await testDatabase.setup()
    await serviceGroupChat.create(jid)
})

afterAll(async () => {
    await serviceGroupChat.remove(jid)
    await testDatabase.down()
    serviceGroupMenu.cache.clearAll()
})

describe('GroupMenu with jid=jidmenu', () => {
    const m = { key: 'key', value: 'value' }
    const im = { key: 'imgkey', value: 'imglocation' }
    it('create text menu', async () => {
        const gc = await serviceGroupChat.findOneByJid(jid)
        const createdMenu = await serviceGroupMenu.createMenuText(gc!, m.key, m.value)
        expect(createdMenu!.groupChat.jid).toBe(jid)
        expect(createdMenu!.key).toBe(m.key)
        expect(createdMenu!.value).toBe(m.value)
        expect(createdMenu!.type).toBe(GroupMenuType.TEXT)

    })
    it('create image menu', async () => {
        const gc = await serviceGroupChat.findOneByJid(jid)
        const createdMenu = await serviceGroupMenu.createMenuImage(gc!, im.key, im.value)
        expect(createdMenu!.groupChat.jid).toBe(jid)
        expect(createdMenu!.key).toBe(im.key)
        expect(createdMenu!.value).toBe(im.value)
        expect(createdMenu!.type).toBe(GroupMenuType.IMAGE)

    })
    it('foundOne menu', async () => {
        const foundMenu = await serviceGroupMenu.findOneMenu(jid, m.key)
        expect(foundMenu!.key).toBe(m.key)
        expect(foundMenu!.value).toBe(m.value)
        expect(foundMenu!.type).toBe(GroupMenuType.TEXT)
    })
    it('findAllMenu', async () => {
        const allMenu = await serviceGroupMenu.findAllMenu(jid)
        expect(allMenu.length).toBe(2)
    })
    it('update menu', async () => {
        m.value = 'value updated'
        const updatedMenu = await serviceGroupMenu.updateMenuValue(jid, m.key, m.value)
        expect(updatedMenu!.value).toBe(m.value)

        await sleep(0)
        const found = await serviceGroupMenu.findOneMenu(jid, m.key)
        expect(found!.value).toBe(m.value)
    })

    it('delete one menu', async () => {
        const deleted = await serviceGroupMenu.removeOneMenu(jid, m.key)
        expect(deleted!.key).toBe(m.key)

        await sleep(0)
        const found = await serviceGroupMenu.findOneMenu(jid, m.key).catch(err => console.log(err))
        expect(found).toBeNull
    })
})



