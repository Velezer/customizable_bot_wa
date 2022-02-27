import { BotWa } from "../BotWa/BotWa";
import { GroupChat } from "../groups/GroupChat";
import { GroupManager } from "../groups/GroupManager";
import { Command, CommandLevel } from "./Command";



export class UpdateCustomMenuCommand implements Command {
    key: string = '/update-menu';
    example: string = '/update-menu /nama-menu data';
    description: string = 'mengupdate menu';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const m12 = conversation.slice(this.key.length + 1)
        let m1 = m12.split(' ')[0]
        const m2 = m12.slice(m1.length + 1)

        const jid = groupChat.jid

        if (!m1) {
            botwa.sendMessage(jid, 'silakan tambahkan data terlebih dahulu')
            return
        }

        if (!m1.startsWith('/')) {
            m1 = '/' + m1
        }

        groupChat.updateGroupCommand(m1, m2)
        GroupManager.update(groupChat)
        botwa.sendMessage(jid, 'menu diupdate')


    }
}

export class AddCustomMenuCommand implements Command {
    key: string = '/add-menu';
    example: string = '/add-menu /nama-menu data';
    description: string = 'menambahkan menu';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const m12 = conversation.slice(this.key.length + 1)
        let m1 = m12.split(' ')[0]
        const m2 = m12.slice(m1.length + 1)

        const jid = groupChat.jid

        if (!m1) {
            botwa.sendMessage(jid, 'silakan tambahkan data terlebih dahulu')
            return
        }

        if (!m1.startsWith('/')) {
            m1 = '/' + m1
        }

        groupChat.addGroupCommand(m1, m2)
        GroupManager.update(groupChat)
        botwa.sendMessage(jid, 'menu ditambahkan')


    }
}



export class RemoveCustomMenuCommand implements Command {
    key: string = '/remove-menu';
    example: string = '/remove-menu /nama-menu';
    description: string = 'menghapus menu';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        let m1 = conversation.slice(this.key.length + 1)

        const jid = groupChat.jid

        if (!m1) {
            botwa.sendMessage(jid, 'kasi nama menunya bos')
            return
        }

        if (!m1.startsWith('/')) {
            groupChat.removeGroupCommand(m1)
            m1 = '/' + m1
        }

        groupChat.removeGroupCommand(m1)
        GroupManager.update(groupChat)
        botwa.sendMessage(jid, 'menu dihapus')


    }
}
