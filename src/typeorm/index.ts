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


export class AppDatabase {
    dataSource: DataSource
    constructor(dataSource: DataSource) {
        this.dataSource = dataSource
        this.dataSource.setOptions({ poolSize: 2 })
    }

    async setup() {
        if (!this.dataSource.isInitialized) return this.dataSource.initialize()
    }

    getServices() {
        const repoGroupMenu = new Repository(GroupMenuEntity, this.dataSource.manager)
        const repoGroupChat = new Repository(GroupChatEntity, this.dataSource.manager)
        const repoAuth = new Repository(AuthEntity, this.dataSource.manager)
        const repoImageStorage = new Repository(ImageStorageEntity, this.dataSource.manager)

        const serviceGroupMenu = new GroupMenuService(repoGroupMenu)
        const serviceGroupChat = new GroupChatService(repoGroupChat)
        const authService = new AuthService(repoAuth)
        const imageStorageService = new ImageStorageService(repoImageStorage)
        return { serviceGroupMenu, serviceGroupChat, authService, imageStorageService }
    }

    down() {
        return this.dataSource.destroy()
    }
}