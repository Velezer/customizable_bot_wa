import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { GroupChatEntity } from "./entity/GroupChatEntity"
import { GroupMenuEntity } from "./entity/GroupMenuEntity"
import { GroupChatService } from "./service/GroupChatService"
import { AuthService } from "./service/AuthService"
import { AuthEntity } from './entity/AuthEntity';
import { GroupMenuService } from "./service/GroupMenuService"
import { ImageStorageService } from './service/ImageStorageService';
import { ImageStorageEntity } from './entity/ImageEntity';
import { FileCacheService } from './service/FileCacheService';


export class AppDatabase {
    dataSource: DataSource
    constructor(dataSource: DataSource) {
        this.dataSource = dataSource
    }

    async setup() {
        if (!this.dataSource.isInitialized) return this.dataSource.initialize()
    }

    getServices() {
        const cache = new FileCacheService()
        const repoGroupMenu = new Repository(GroupMenuEntity, this.dataSource.manager)
        const serviceGroupMenu = new GroupMenuService(repoGroupMenu, cache)
        const repoGroupChat = new Repository(GroupChatEntity, this.dataSource.manager)
        const serviceGroupChat = new GroupChatService(repoGroupChat, cache)

        const authService = new AuthService(new Repository(AuthEntity, this.dataSource.manager))
        const imageStorageService = new ImageStorageService(new Repository(ImageStorageEntity, this.dataSource.manager))
        return { serviceGroupMenu, serviceGroupChat, authService, imageStorageService }
    }

    down() {
        return this.dataSource.destroy()
    }
}