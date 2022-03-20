import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm"
import { GroupChatEntity } from './GroupChat';

enum GroupMenuType {
    TEXT = 'text',
    IMAGE = 'image'
}

@Entity('group_menu')
export class GroupMenuEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    jid!: string

    @Column()
    key!: string

    @Column()
    value!: string

    @Column({ type: 'enum', enum: GroupMenuType })
    type!: GroupMenuType

    @ManyToOne(() => GroupChatEntity, (gc) => gc.groupMenu)
    groupChat!: GroupChatEntity;


}
