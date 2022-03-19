import { BotLevel } from "../src/groups/interface"
import { AppDataSource } from "./data-source"
import { GroupChat } from "./entity/GroupChat"

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new gc into the database...")
    const gc = new GroupChat()
    gc.jid = 'jid'
    gc.botLevel = BotLevel.ELEGANT
    await AppDataSource.manager.save(gc)
    console.log("Saved a new user with id: " + gc.id)

    console.log("Loading gcs from the database...")
    const gcs = await AppDataSource.manager.find(GroupChat)
    console.log("Loaded gcs: ", gcs)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
