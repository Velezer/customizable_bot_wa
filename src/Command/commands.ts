import { BotWa } from "../BotWa/BotWa";
import { GroupManager } from "../groups/GroupManager";
import { Command, CommandLevel } from "./interface";
import { GroupChat } from "../groups/GroupChat";
import { LoggerOcedBot } from "../logger/Logger";
import { BotLevel } from "../groups/interface";
import { proto } from "@adiwajshing/baileys";






export class TagAllCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
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
    botLevel: BotLevel = BotLevel.BASIC
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
    botLevel: BotLevel = BotLevel.BASIC
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
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/open-setting';
    example: string = this.key;
    description: string = 'open setting grup';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {

        botwa.openGroupSettings(groupChat.jid)

    }

}
export class CloseGroupSettingsCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/close-setting';
    example: string = this.key;
    description: string = 'close setting grup';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {

        botwa.closeGroupSettings(groupChat.jid)

    }

}
export class OpenGroupChatCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/open-chat';
    description: string = 'open grup chat';
    example: string = this.key;

    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {

        botwa.openGroupChat(groupChat.jid)

    }

}
export class CloseGroupChatCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/close-chat';
    example: string = this.key;
    description: string = 'close grup chat';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {

        botwa.closeGroupChat(groupChat.jid)

    }

}
export class PromoteCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
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
            .catch(err => {
                botwa.sendMessage(groupChat.jid, 'promote gagal')
            })

    }

}

export class DemoteCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
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
            .catch(err => {
                botwa.sendMessage(groupChat.jid, 'demote gagal')
            })

    }

}
export class DeleteBotTypeCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/delete';
    example: string = this.key;
    description: string = 'delete kalo bot nya typo';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string, msgKey: proto.IMessageKey): Promise<void> {
        botwa.deleteMessage(msgKey)
    }

}
export class KickCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/kick';
    example: string = this.key + ' 00000000';
    description: string = 'kick beban grup';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string, msgKey: proto.IMessageKey): Promise<void> {
        let m1 = conversation.slice(this.key.length + 1)

        if (m1.startsWith('@')) {
            m1 = m1.slice(1)
        }
        botwa.kick(groupChat.jid, m1)
            .catch(err => {
                botwa.sendMessage(groupChat.jid, 'kick gagal')
            })

    }

}



export class JoinGroupCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
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



