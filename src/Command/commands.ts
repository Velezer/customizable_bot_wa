import { BotWa } from "../BotWa/BotWa";
import { GroupManager } from "../groups/GroupManager";
import { Command, CommandLevel } from "./Command";
import { OcedBot } from "../ocedbot/OcedBot";
import { GroupChat } from "../groups/GroupChat";
import { LoggerOcedBot } from "../logger/Logger";
import { plainToClass } from "class-transformer";




export class MenuCommand implements Command {
    key: string = '/menu';
    description: string = 'nampilin menu';
    example: string = this.key;
    level: CommandLevel = CommandLevel.ADMIN;
    allCommands: Command[];

    constructor(allCommands: Command[]) {
        this.allCommands = allCommands
    }


    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {

        let msg = ''
        msg += '_Main Menu_\n\n'
        this.allCommands.forEach(command => {
            if (groupChat.commandKeys.includes(command.key)) {
                msg += `${command.example} \n${command.description}\n\n`
            }
        })

        if (groupChat.groupCommands.length > 0) {
            msg += '\n\n_Custom Menu_\n\n'
            groupChat.groupCommands.forEach(command => {
                msg += `${command.key}\n\n`
            })
        }


        msg = msg.slice(0, -2)
        await botwa.sendMessage(groupChat.jid, msg);

    }
}

export class TagAllCommand implements Command {
    key: string = '/tag-all';
    description: string = 'ngetag seluruh grup';
    example: string = this.key + ' pesan';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const m1 = conversation.slice(this.key.length + 1)

        if (!m1) {
            botwa.sendMentionedAll(groupChat.jid, '')
            return
        }
        await botwa.sendMentionedAll(groupChat.jid, m1)

    }

}

export class GetGroupMetadataCommand implements Command {
    key: string = '/group-data';
    example: string = this.key;
    description: string = 'data grup';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {

        const metadata = await botwa.getGroupMetadata(groupChat.jid)

        let desc = metadata.desc || ''

        let msg = ''
        msg += metadata.subject + '\n\n'
        msg += '_Deskripsi_\n'
        msg += desc + '\n\n'
        msg += '---'
        msg += 'owner grup wa.me/' + metadata.owner?.split('@')[0] + '\n\n'
        msg += 'list member:\n'

        metadata.participants.forEach(p => {
            const role = p.isAdmin ? 'admin' : 'member'
            msg += role + ' ' + 'wa.me/' + p.jid.split('@')[0] + '\n'
        })
        msg.slice(0, -1)
        await botwa.sendMessage(groupChat.jid, msg)

    }

}
export class GetGroupParticipantsCommand implements Command {
    key: string = '/group-member';
    description: string = 'list member grup';
    example: string = this.key;
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const jid = groupChat.jid
        const participants = await botwa.getGroupParticipants(jid)
        const neatParticipants = participants.map(p => p.jid.split('@')[0])

        let msg = ''
        neatParticipants.forEach(p => {
            msg += p + '\n'
        })
        msg.slice(0. - 1)

        await botwa.sendMessage(jid, msg)

    }

}

export class OpenGroupSettingsCommand implements Command {
    key: string = '/open-setting';
    example: string = this.key;
    description: string = 'open setting grup';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {

        botwa.openGroupSettings(groupChat.jid)

    }

}
export class CloseGroupSettingsCommand implements Command {
    key: string = '/close-setting';
    example: string = this.key;
    description: string = 'close setting grup';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {

        botwa.closeGroupSettings(groupChat.jid)

    }

}
export class OpenGroupChatCommand implements Command {
    key: string = '/open-chat';
    description: string = 'open grup chat';
    example: string = this.key;

    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {

        botwa.openGroupChat(groupChat.jid)

    }

}
export class CloseGroupChatCommand implements Command {
    key: string = '/close-chat';
    example: string = this.key;
    description: string = 'close grup chat';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {

        botwa.closeGroupChat(groupChat.jid)

    }

}
export class PromoteCommand implements Command {
    key: string = '/promote';
    example: string = this.key + ' 0000000000';
    description: string = 'promote member grup';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        let m1 = conversation.slice(this.key.length + 1)

        if (m1.startsWith('@')) {
            m1 = m1.slice(1)
        }

        botwa.promote(groupChat.jid, m1)
            .then(() => {
                botwa.sendMessage(groupChat.jid, m1 + ' dipromote')
            }).catch(err => {
                botwa.sendMessage(groupChat.jid, 'promote gagal')
            })

    }

}

export class DemoteCommand implements Command {
    key: string = '/demote';
    example: string = this.key + ' 0000000000';
    description: string = 'demote member grup';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        let m1 = conversation.slice(this.key.length + 1)

        if (m1.startsWith('@')) {
            m1 = m1.slice(1)
        }
        botwa.demote(groupChat.jid, m1)
            .then(() => {
                botwa.sendMessage(groupChat.jid, m1 + ' didemote')
            }).catch(err => {
                botwa.sendMessage(groupChat.jid, 'demote gagal')
            })

    }

}



export class JoinGroupCommand implements Command {
    key: string = '/join';
    example: string = '/join link';
    description: string = '/join grup pake link';
    level: CommandLevel = CommandLevel.OCEDBOT;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const m1 = conversation.slice(this.key.length + 1)

        botwa.joinGroup(m1)
            .then(() => {
                LoggerOcedBot.log(botwa, 'bot masuk grup link ' + m1)
            })
            .catch(err => {
                console.log(err)
                botwa.sendMessage(groupChat.jid, 'bot gagal masuk grup link ' + m1)
            })

    }
}



export class CustomMenuCommand implements Command {
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

export class ActivateCommand implements Command {
    key: string = '/activate';
    example: string = '/activate /command';
    description: string = 'mengaktifkan command';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const m1 = conversation.slice(this.key.length + 1)

        const jid = groupChat.jid

        if (!m1) {
            botwa.sendMessage(jid, 'kasi nama command nya bos')
            return
        }

        groupChat.addCommandKey(m1)
        GroupManager.update(groupChat)
        botwa.sendMessage(jid, 'command ditambahkan')


    }
}
export class DeactivateCommand implements Command {
    key: string = '/deactivate';
    example: string = '/deactivate /command';
    description: string = 'menonaktifkan command';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const m1 = conversation.slice(this.key.length + 1)

        const jid = groupChat.jid

        if (!m1) {
            botwa.sendMessage(jid, 'kasi nama command nya bos')
            return
        }

        groupChat.removeCommandkey(m1)
        GroupManager.update(groupChat)
        botwa.sendMessage(jid, 'command dinonaktifkan')


    }
}

