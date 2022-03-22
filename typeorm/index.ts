import { Repository } from "typeorm"
import { BotLevel } from "../src/groups/interface"
import { AppDataSource } from "./data-source"
import { GroupChatEntity } from "./entity/GroupChatEntity"
import { GroupChatService } from './service/GroupChatService';

AppDataSource.initialize().then(async () => {
    const repo = new Repository(GroupChatEntity, AppDataSource.manager)
    const service = new GroupChatService(repo)
    console.log("Inserting a new gc into the database...")
    const gc = new GroupChatEntity()
    gc.jid = 'jidtrial1'
    await service.create(gc.jid)
    console.log("Saved a new user with id: " + gc.id)

    console.log("Loading gcs from the database...")
    const gcs = await AppDataSource.manager.find(GroupChatEntity)
    console.log("Loaded gcs: ", gcs)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
