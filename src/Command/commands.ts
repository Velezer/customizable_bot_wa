import { BotWa } from "../BotWa/BotWa";
import { Command } from "./Command";

export class ActivateCommand implements Command {
    key: string = '/activate';
    example: string = this.key;
    description: string = 'mengaktifkan bot';

    async run(botwa: BotWa, to: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]

        botwa.activate(to)
        await botwa.sendMessage(to, 'bot aktif');

    }
}

export class CekCommand implements Command {
    key: string = '/cek';
    example: string = this.key;
    description: string = 'cek keaktifan bot';

    async run(botwa: BotWa, to: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]

        await botwa.sendMessage(to, 'bot sudah aktif');

    }
}

export class MenuCommand implements Command {
    key: string = '/menu';
    description: string = 'nampilin menu';
    example: string = this.key;
    allCommands: Command[];

    constructor(allCommands: Command[]) {
        this.allCommands = allCommands
    }


    async run(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {

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

    async run(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {
        const m1 = receivedMessage.substring(`${this.key.length} `.length)

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

    async run(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {

        const metadata = await botwa.getGroupMetadata(jid)

        let desc = metadata.desc || ''

        let msg = ''
        msg += metadata.subject + '\n\n'
        msg += desc + '\n\n'
        msg += 'owner grup @' + metadata.owner?.split('@')[0] + '\n\n'
        msg += 'list member:\n'

        metadata.participants.forEach(p => {
            const role = p.isAdmin ? 'admin' : 'beban'
            msg += role + ' ' + '@' + p.jid.split('@')[0] + '\n'
        })
        msg.slice(0, -1)
        await botwa.sendMessage(jid, msg)

    }

}
export class GetGroupParticipantsCommand implements Command {
    key: string = '/group-member';
    description: string = 'list member grup';
    example: string = this.key;


    async run(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {

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


    async run(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {

        botwa.openGroupSettings(jid)

    }

}
export class CloseGroupSettingsCommand implements Command {
    key: string = '/close-setting';
    example: string = this.key;
    description: string = 'close setting grup';


    async run(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {

        botwa.closeGroupSettings(jid)

    }

}
export class OpenGroupChatCommand implements Command {
    key: string = '/open-chat';
    description: string = 'open grup chat';
    example: string = this.key;


    async run(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {

        botwa.openGroupChat(jid)

    }

}
export class CloseGroupChatCommand implements Command {
    key: string = '/close-chat';
    example: string = this.key;
    description: string = 'close grup chat';


    async run(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {

        botwa.closeGroupChat(jid)

    }

}
export class PromoteCommand implements Command {
    key: string = '/promote';
    example: string = this.key + ' 0000000000';
    description: string = 'promote nomor di grup';


    async run(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {
        const m1 = receivedMessage.substring(`${this.key.length} `.length)

        botwa.prmote(jid, m1)

    }

}
export class DemoteCommand implements Command {
    key: string = '/promote';
    example: string = this.key + ' 0000000000';
    description: string = 'promote nomor di grup';


    async run(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {
        const m1 = receivedMessage.substring(`${this.key.length} `.length)

        botwa.demote(jid, m1)

    }

}



// export class JoinGrupCommand implements Command {
//     key: string = '/join link';
//     replyMessageOnSuccess: string = 'udah masuk grup bro';

//     async run(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {
//         const receivedKey = receivedMessage?.split(' ')[0]
//         const m1 = receivedMessage!.split(`${this.key} `)[1]

//         if (receivedKey === this.key) {
//             botwa.joinGroup(link)
//         }

//     }
// }


