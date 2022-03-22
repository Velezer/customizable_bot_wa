import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, JoinTable } from "typeorm"
import { GroupChatEntity } from './GroupChatEntity';
import { LocalColumn } from './decorator/LocalColumn';

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

    @LocalColumn(
        { type: 'enum', enum: GroupMenuType },
        { type: 'simple-enum' }
    )
    type!: GroupMenuType

    @ManyToOne(() => GroupChatEntity, (gc) => gc.groupMenu, { onDelete: 'CASCADE' })
    // @JoinColumn()
    groupChat!: GroupChatEntity;


}