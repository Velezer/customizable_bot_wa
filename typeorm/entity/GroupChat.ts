import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { BotLevel } from "../../src/groups/interface"
import { GroupMenuEntity } from './GroupMenu';

@Entity('group_chat')
export class GroupChatEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true, nullable: false })
    jid!: string

    @Column({ nullable: true })
    welcome!: string

    @Column({ type: 'enum', enum: BotLevel, default: BotLevel.BASIC })
    botLevel!: BotLevel

    @Column({ default: false })
    blacklist!: boolean

    @OneToMany(() => GroupMenuEntity, groupMenu => groupMenu.groupChat)
    groupMenu!: GroupMenuEntity[]

    @Column({ type: 'timestamp', default: null })
    trialExpiredAt!: Date

    @Column({ type: 'timestamp', default: null })
    sewaExpiredAt!: Date
}
