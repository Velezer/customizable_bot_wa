import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { BotLevel } from "../../src/groups/interface"
import { GroupChatEntity } from "../entity/GroupChat"
import { GroupMenuEntity } from "../entity/GroupMenu"
import { GroupChatService } from "./GroupChat"

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
let repo: Repository<GroupChatEntity> = new Repository(GroupChatEntity, dataSource.manager)
let service: GroupChatService= new GroupChatService(repo)

beforeAll(async () => {
    await dataSource.initialize().catch(err => console.log(err))
})

afterAll(async () => {
    await dataSource.destroy()
})

it('create GroupChat', async () => {
    const res = await service.create('jid')
    console.log(res)
    expect(res.jid).toBe('jid')
    expect(res.blacklist).toBe(false)
    expect(res.botLevel).toBe(BotLevel.BASIC)
    expect(res.trialExpiredAt).toBe(null)
    expect(res.sewaExpiredAt).toBe(null)
    expect(res.welcome).toBe(null)
})

