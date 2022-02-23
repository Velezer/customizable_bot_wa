import { BotWa } from "../BotWa/BotWa";
import { Command } from "./Command";

export class ActivateCommand implements Command {
    key: string = '/activate';
    description: string = 'mengaktifkan bot';

    async cb(botwa: BotWa, to: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]

        if (receivedKey === this.key) {
            botwa.activate(to)
            await botwa.sendMessage(to, 'bot aktif');
        }

    }
}

export class CekCommand implements Command {
    key: string = '/cek';
    description: string = 'cek keaktifan bot';

    async cb(botwa: BotWa, to: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]

        if (receivedKey === this.key) {
            await botwa.sendMessage(to, 'bot sudah aktif');
        }

    }
}

export class MenuCommand implements Command {
    key: string = '/menu';
    description: string = 'nampilin menu';
    allCommands: Command[];

    constructor(allCommands: Command[]) {
        this.allCommands = allCommands
    }


    async cb(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]

        if (receivedKey === this.key) {

            let msg = ''
            this.allCommands.forEach(command => {
                msg += `${command.key} \n${command.description}\n\n`
            })
            msg = msg.slice(0, -2)
            await botwa.sendMessage(jid, msg);
        }

    }
}

export class TagAllCommand implements Command {
    key: string = '/tag-all pesan';
    description: string = 'ngetag seluruh grup';
    groupAdminOnly: boolean = true;

    async cb(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]
        const m1 = receivedMessage!.split('/tag-all ')[1]

        if (receivedKey === this.key) {
            await botwa.sendMentioned(jid, m1)

        }

    }

}

export class GetGroupMetadataCommand implements Command {
    key: string = '/group-data';
    description: string = 'data grup';
    groupAdminOnly: boolean = true;

    async cb(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]

        if (receivedKey === this.key) {
            const metadata = await botwa.getGroupMetadata(jid)

            let desc = metadata.desc || ''

            let msg = ''
            msg += metadata.subject + '\n\n'
            msg += desc + '\n\n'
            msg += 'owner grup @' + metadata.owner?.split('@')[0] + '\n\n'
            msg += 'list member:\n'

            metadata.participants.forEach(p => {
                const role = p.admin || 'beban'
                msg += role + ' ' + '@' + p.id.split('@')[0] + '\n'
            })
            msg.slice(0, -1)
            await botwa.sendMessage(jid, msg)
        }

    }

}
export class GetGroupParticipantsCommand implements Command {
    key: string = '/group-member';
    description: string = 'list member grup';
    groupAdminOnly: boolean = true;


    async cb(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]

        if (receivedKey === this.key) {
            const participants = await botwa.getGroupParticipants(jid)
            const neatParticipants = participants.map(p => p.id.split('@')[0])

            let msg = ''
            neatParticipants.forEach(p => {
                msg += p + '\n'
            })
            msg.slice(0. - 1)

            await botwa.sendMessage(jid, msg)
        }

    }

}

export class OpenGroupSettingsCommand implements Command {
    key: string = '/open-setting';
    description: string = 'open setting grup';
    groupAdminOnly: boolean = true;


    async cb(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]

        if (receivedKey === this.key) {
            botwa.openGroupSettings(jid)
        }

    }

}
export class CloseGroupSettingsCommand implements Command {
    key: string = '/close-setting';
    description: string = 'close setting grup';
    groupAdminOnly: boolean = true;


    async cb(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]

        if (receivedKey === this.key) {
            botwa.closeGroupSettings(jid)
        }

    }

}
export class OpenGroupChatCommand implements Command {
    key: string = '/open-chat';
    description: string = 'open grup chat';
    groupAdminOnly: boolean = true;


    async cb(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]

        if (receivedKey === this.key) {
            botwa.openGroupChat(jid)
        }

    }

}
export class CloseGroupChatCommand implements Command {
    key: string = '/close-chat';
    description: string = 'close grup chat';
    groupAdminOnly: boolean = true;


    async cb(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]

        if (receivedKey === this.key) {
            botwa.closeGroupChat(jid)
        }

    }

}



// export class JoinGrupCommand implements Command {
//     key: string = '/join link';
//     replyMessageOnSuccess: string = 'udah masuk grup bro';

//     async cb(botwa: BotWa, jid: string, receivedMessage: string): Promise<void> {
//         const receivedKey = receivedMessage?.split(' ')[0]
//         const m1 = receivedMessage!.split(`${this.key} `)[1]

//         if (receivedKey === this.key) {
//             botwa.joinGroup(link)
//         }

//     }
// }


