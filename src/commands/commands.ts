import { BotLevel } from "../groups/interface";
import { Command, CommandLevel, RunArgs } from "./interface";



export class TagAllCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/tag-all';
    description: string = 'ngetag seluruh grup';
    example: string = this.key + ' pesan';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat } = args

        const m1 = conversation.slice(this.key.length + 1)

        if (!m1) {
            botwa.sendMentionedAll(groupChat!.jid, '')
            return
        }
        await botwa.sendMentionedAll(groupChat!.jid, m1)

    }

}

export class GetGroupMetadataCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/group-data';
    example: string = this.key;
    description: string = 'data grup';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat } = args

        const metadata = await botwa.getGroupMetadata(groupChat!.jid)

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
            msg += role + ' ' + 'wa.me/' + p.id.split('@')[0] + '\n'
        })
        msg.slice(0, -1)
        await botwa.sendText(groupChat!.jid, msg)

    }

}
export class GetGroupParticipantsCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/group-member';
    description: string = 'list member grup';
    example: string = this.key;
    level: CommandLevel = CommandLevel.ADMIN;


    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat } = args

        const jid = groupChat!.jid
        const participants = await botwa.getGroupParticipants(jid)
        const neatParticipants = participants.map(p => p.id.split('@')[0])

        let msg = ''
        neatParticipants.forEach(p => {
            msg += p + '\n'
        })
        msg.slice(0. - 1)

        await botwa.sendText(jid, msg)

    }

}

export class OpenGroupSettingsCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/open-setting';
    example: string = this.key;
    description: string = 'open setting grup';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat } = args


        botwa.openGroupSettings(groupChat!.jid)

    }

}
export class CloseGroupSettingsCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/close-setting';
    example: string = this.key;
    description: string = 'close setting grup';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat } = args


        botwa.closeGroupSettings(groupChat!.jid)

    }

}
export class OpenGroupChatCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/open-chat';
    description: string = 'open grup chat';
    example: string = this.key;

    level: CommandLevel = CommandLevel.ADMIN;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat } = args


        botwa.openGroupChat(groupChat!.jid)

    }

}
export class CloseGroupChatCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/close-chat';
    example: string = this.key;
    description: string = 'close grup chat';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat } = args

        botwa.closeGroupChat(groupChat!.jid)

    }

}
