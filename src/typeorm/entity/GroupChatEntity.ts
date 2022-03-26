import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { BotLevel } from "../../groups/interface"
import { GroupMenuEntity } from './GroupMenuEntity'
import { LocalColumn } from './decorator/LocalColumn'

@Entity('group_chat')
export class GroupChatEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true, nullable: false })
    jid!: string

    @Column({ nullable: true })
    welcome!: string

    @LocalColumn(
        { type: 'enum', enum: BotLevel, default: BotLevel.BASIC },
        { type: 'simple-enum' }
    )
    botLevel!: BotLevel

    @Column({ default: false })
    blacklist!: boolean

    @OneToMany(() => GroupMenuEntity, groupMenu => groupMenu.groupChat)
    groupMenu!: GroupMenuEntity[]

    @LocalColumn(
        { type: 'timestamp with time zone', default: null },
        { type: 'datetime' }
    )
    trialExpiredAt!: Date

    @LocalColumn(
        { type: 'timestamp with time zone', default: null },
        { type: 'datetime' }
    )
    sewaExpiredAt!: Date
}
