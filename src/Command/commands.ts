import { BotWa } from "../BotWa/BotWa";
import { GroupManager } from "../groups/GroupManager";
import { Command, CommandLevel } from "./Command";
import fs from "fs"
import { OcedBot } from "../ocedbot/OcedBot";

export class ActivateCommand implements Command {
    key: string = '/activate';
    example: string = this.key;
    description: string = 'mengaktifkan bot';
    level: CommandLevel = CommandLevel.DEVELOPER;

    async run(botwa: BotWa, to: string, conversation: string): Promise<void> {
        botwa.activate(to)
        await botwa.sendMessage(to, 'bot aktif');

    }
}


export class CekCommand implements Command {
    key: string = '/cek';
    example: string = this.key;
    description: string = 'cek keaktifan bot';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(botwa: BotWa, to: string, conversation: string): Promise<void> {
        await botwa.sendMessage(to, 'bot sudah aktif');

    }
}

export class MenuCommand implements Command {
    key: string = '/menu';
    description: string = 'nampilin menu';
    example: string = this.key;
    level: CommandLevel = CommandLevel.ADMIN;
    allCommands: Command[];

    constructor(allCommands: Command[]) {
        this.allCommands = allCommands
    }


    async run(botwa: BotWa, jid: string, conversation: string): Promise<void> {

        let msg = ''
        this.allCommands.forEach(command => {
            msg += `${command.example} \n${command.description}\n\n`
        })
        msg = msg.slice(0, -2)
        await botwa.sendMessage(jid, msg);

    }
}

export class TagAllCommand implements Command {
    key: string = '/tag-all';
    description: string = 'ngetag seluruh grup';
    example: string = this.key + ' pesan';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, jid: string, conversation: string): Promise<void> {
        const m1 = conversation.slice(this.key.length + 1)

        if (!m1) {
            botwa.sendMentionedAll(jid, '')
            return
        }
        await botwa.sendMentionedAll(jid, m1)

    }

}

export class GetGroupMetadataCommand implements Command {
    key: string = '/group-data';
    example: string = this.key;
    description: string = 'data grup';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, jid: string, conversation: string): Promise<void> {

        const metadata = await botwa.getGroupMetadata(jid)

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
        await botwa.sendMessage(jid, msg)

    }

}
export class GetGroupParticipantsCommand implements Command {
    key: string = '/group-member';
    description: string = 'list member grup';
    example: string = this.key;
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, jid: string, conversation: string): Promise<void> {

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


    async run(botwa: BotWa, jid: string, conversation: string): Promise<void> {

        botwa.openGroupSettings(jid)

    }

}
export class CloseGroupSettingsCommand implements Command {
    key: string = '/close-setting';
    example: string = this.key;
    description: string = 'close setting grup';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, jid: string, conversation: string): Promise<void> {

        botwa.closeGroupSettings(jid)

    }

}
export class OpenGroupChatCommand implements Command {
    key: string = '/open-chat';
    description: string = 'open grup chat';
    example: string = this.key;

    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, jid: string, conversation: string): Promise<void> {

        botwa.openGroupChat(jid)

    }

}
export class CloseGroupChatCommand implements Command {
    key: string = '/close-chat';
    example: string = this.key;
    description: string = 'close grup chat';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, jid: string, conversation: string): Promise<void> {

        botwa.closeGroupChat(jid)

    }

}
export class PromoteCommand implements Command {
    key: string = '/promote';
    example: string = this.key + ' 0000000000';
    description: string = 'promote member grup';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, jid: string, conversation: string): Promise<void> {
        const m1 = conversation.slice(this.key.length + 1)

        botwa.promote(jid, m1)
        botwa.sendMessage(jid, m1 + ' dipromote')

    }

}

export class DemoteCommand implements Command {
    key: string = '/demote';
    example: string = this.key + ' 0000000000';
    description: string = 'demote member grup';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, jid: string, conversation: string): Promise<void> {
        const m1 = conversation.slice(this.key.length + 1)
        botwa.demote(jid, m1)

        botwa.sendMessage(jid, m1 + ' didemote')
    }

}



export class JoinGroupCommand implements Command {
    key: string = '/join';
    example: string = '/join link';
    description: string = '/join grup pake link';
    level: CommandLevel = CommandLevel.DEVELOPER;

    async run(botwa: BotWa, jid: string, conversation: string): Promise<void> {
        const m1 = conversation.slice(this.key.length + 1)

        botwa.joinGroup(m1)

    }
}

export class RegisterGroupCommand implements Command {
    key: string = '/sewa';
    example: string = '/sewa key-aktivasi';
    description: string = 'sewa bot 30 hari biar grup ini bisa pake';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(botwa: BotWa, jid: string, conversation: string): Promise<void> {
        const m1 = conversation.slice(this.key.length + 1)

        if (!m1) {
            botwa.sendMessage(jid, 'silakan hubungi wa.me/' + OcedBot.getPhoneNumber() + ' untuk mendapatkan key-aktivasi')
            return
        }

        const activationKey = OcedBot.getActivationKey()
        if (m1 === activationKey) {
            botwa.sendMessage(jid, 'sedang mengaktivasi...')

            let isRegistered = false
            try {
                isRegistered = GroupManager.register(jid)
            } catch (err) {
                console.error(err)
                botwa.sendMessage(jid, 'aktivasi gagal, mohon hubungi wa.me/' + OcedBot.getPhoneNumber())
                return
            }

            if (isRegistered) {
                botwa.sendMessage(jid, 'aktivasi sukses')

                OcedBot.generateActivationKey()
            }
        } else {
            botwa.sendMessage(jid, 'aktivasi gagal, mohon periksa key-aktivasi anda')

        }

    }
}

