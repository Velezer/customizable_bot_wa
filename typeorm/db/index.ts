import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { GroupChatEntity } from "../entity/GroupChatEntity"
import { GroupMenuEntity } from "../entity/GroupMenuEntity"
import { GroupChatService } from "../service/GroupChatService"
import { GroupMenuService } from "../service/GroupMenuService"


export class AppDatabase {
    dataSource: DataSource
    constructor(dataSource: DataSource) {
        this.dataSource = dataSource
    }

    setup() {
        return this.dataSource.initialize()
    }

    getServices() {
        const repoGroupMenu = new Repository(GroupMenuEntity, this.dataSource.manager)
        const serviceGroupMenu = new GroupMenuService(repoGroupMenu)
        const repoGroupChat = new Repository(GroupChatEntity, this.dataSource.manager)
        const serviceGroupChat = new GroupChatService(repoGroupChat)
        return { serviceGroupMenu, serviceGroupChat }
    }

    down() {
        return this.dataSource.destroy()
    }
}