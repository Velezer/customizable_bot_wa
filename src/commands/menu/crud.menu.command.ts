import { BotLevel } from "../../groups/interface";
import { Command, CommandLevel, RunArgs } from "../interface";




export class AddCustomMenuCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/add-menu';
    example: string = '/add-menu /nama-menu data';
    description: string = 'menambahkan menu';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat, services } = args
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

        services.serviceGroupMenu.createMenuText(groupChat, m1, m2)
        
        botwa.sendMessage(jid, 'menu ditambahkan')


    }
}


export class UpdateCustomMenuCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/update-menu';
    example: string = '/update-menu /nama-menu data';
    description: string = 'mengupdate menu';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat, services } = args
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

        services.serviceGroupMenu.updateMenuValue(groupChat.jid, m1, m2)
        
        botwa.sendMessage(jid, 'menu diupdate')


    }
}
export class RemoveCustomMenuCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/remove-menu';
    example: string = '/remove-menu /nama-menu';
    description: string = 'menghapus menu';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat, services } = args
 
        let m1 = conversation.slice(this.key.length + 1)

        const jid = groupChat.jid

        if (!m1) {
            botwa.sendMessage(jid, 'kasi nama menunya bos')
            return
        }

        if (!m1.startsWith('/')) {
            m1 = '/' + m1
        }

        services.serviceGroupMenu.removeOneMenu(groupChat.jid, m1)

        botwa.sendMessage(jid, 'menu dihapus')


    }
}
