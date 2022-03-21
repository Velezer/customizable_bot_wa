import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, JoinTable } from "typeorm"
import { GroupChatEntity } from './GroupChat';
import { LocalColumn } from '../helper/LocalColumn';

export enum GroupMenuType {
    TEXT = 'text',
    IMAGE = 'image'
}

@Entity('group_menu')
export class GroupMenuEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    key!: string

    @Column()
    value!: string

    @LocalColumn({ type: 'enum', enum: GroupMenuType }, 'simple-enum')
    type!: GroupMenuType

    @ManyToOne(() => GroupChatEntity, (gc) => gc.groupMenu)
    groupChat!: GroupChatEntity;


}
