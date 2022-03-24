import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { GroupChatEntity } from "./entity/GroupChatEntity"
import { GroupMenuEntity } from "./entity/GroupMenuEntity"
import { GroupChatService } from "./service/GroupChatService"
import { AuthService } from "./service/AuthService"
import { AuthEntity } from './entity/AuthEntity';
import { GroupMenuService } from "./service/GroupMenuService"


export class AppDatabase {
    dataSource: DataSource
    constructor(dataSource: DataSource) {
        this.dataSource = dataSource
    }

   async setup() {
        await this.dataSource.initialize()
        await this.dataSource.queryResultCache?.connect()
        await this.dataSource.queryResultCache?.synchronize()
    }

    getServices() {
        const repoGroupMenu = new Repository(GroupMenuEntity, this.dataSource.manager)
        const serviceGroupMenu = new GroupMenuService(repoGroupMenu)
        const repoGroupChat = new Repository(GroupChatEntity, this.dataSource.manager)
        const serviceGroupChat = new GroupChatService(repoGroupChat, this.dataSource.queryResultCache)

        const authService = new AuthService(new Repository(AuthEntity, this.dataSource.manager))
        return { serviceGroupMenu, serviceGroupChat, authService }
    }

    down() {
        return this.dataSource.destroy()
    }
}