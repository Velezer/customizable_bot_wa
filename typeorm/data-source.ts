import "reflect-metadata"
import { DataSource } from "typeorm"
import { GroupChat } from "./entity/GroupChat"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "192.168.56.102",
    port: 5432,
    username: "user",
    password: "password",
    database: "botwa",
    synchronize: true,
    logging: false,
    entities: [GroupChat],
    migrations: [],
    subscribers: [],
})
