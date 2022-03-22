import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { GroupChatEntity } from "../entity/GroupChatEntity"
import { GroupMenuEntity } from "../entity/GroupMenuEntity"
import { GroupChatService } from "../service/GroupChatService"
import { GroupMenuService } from "../service/GroupMenuService"

process.env.NODE_ENV = 'test'
export class TestHelper {
    static testDataSource: DataSource = new DataSource({
        type: 'better-sqlite3',
        database: ":memory:",
        dropSchema: true,
        synchronize: true,
        logging: false,
        entities: [GroupChatEntity, GroupMenuEntity],
        migrations: [],
        subscribers: [],
    })

    static setup() {
        return this.testDataSource.initialize()
    }

    static getServices() {
        const repoGroupMenu = new Repository(GroupMenuEntity, this.testDataSource.manager)
        const serviceGroupMenu = new GroupMenuService(repoGroupMenu)
        const repoGroupChat = new Repository(GroupChatEntity, this.testDataSource.manager)
        const serviceGroupChat = new GroupChatService(repoGroupChat)
        return { serviceGroupMenu, serviceGroupChat }
    }

    static down() {
        return this.testDataSource.destroy()
    }
}