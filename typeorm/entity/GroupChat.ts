import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { BotLevel } from "../../src/groups/interface"
import { GroupMenuEntity } from './GroupMenu'
import { AwareColumn } from '../helper/awarecolumn.decorator.ts'

@Entity('group_chat')
export class GroupChatEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true, nullable: false })
    jid!: string

    @Column({ nullable: true })
    welcome!: string

    @AwareColumn({ type: 'enum', enum: BotLevel, default: BotLevel.BASIC })
    botLevel!: BotLevel

    @Column({ default: false })
    blacklist!: boolean

    @OneToMany(() => GroupMenuEntity, groupMenu => groupMenu.groupChat)
    groupMenu!: GroupMenuEntity[]

    @AwareColumn({ type: 'timestamp', default: null })
    trialExpiredAt!: Date

    @AwareColumn({ type: 'timestamp', default: null })
    sewaExpiredAt!: Date
}
