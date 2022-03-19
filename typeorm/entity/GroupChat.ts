import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { BotLevel } from "../../src/groups/interface"

@Entity()
export class GroupChat {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true, nullable: false })
    jid!: string

    @Column()
    welcome!: string

    @Column({ type: 'enum', enum: BotLevel, default: BotLevel.BASIC })
    botLevel!: BotLevel

    @Column({ array: true })
    groupMenu!: { key: string, value: string }[]

    @Column({ array: true })
    imageMenu!: { key: string, fileLocation: string }[]

    @Column({ default: false })
    trial!: boolean

    @Column({ type: 'datetime', default: () => 'NOW()' })
    registeredAt!: Date
}
