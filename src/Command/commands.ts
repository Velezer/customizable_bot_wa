import { BotWa } from "../BotWa/BotWa";
import { Command } from "./Command";



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


    async cb(botwa: BotWa, to: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]

        if (receivedKey === this.key) {

            let msg = ''
            this.allCommands.forEach(command => {
                msg += `${command.key} \n${command.description}\n\n`
            })
            msg = msg.slice(0, -2)
            await botwa.sendMessage(to, msg);
        }

    }
}

export class TagAllCommand implements Command {
    key: string = '/tag-all';
    description: string = 'ngetag seluruh grup';

    async cb(botwa: BotWa, to: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]
        const m1 = receivedMessage!.split('/tag-all ')[1]

        if (receivedKey === this.key) {

        }

    }

}

export class GetGroupMetadataCommand implements Command {
    key: string = '/group-metadata';
    description: string = 'dev only';

    async cb(botwa: BotWa, to: string, receivedMessage: string): Promise<void> {
        const receivedKey = receivedMessage?.split(' ')[0]

        if (receivedKey === this.key) {
            const metadata = await botwa.getGroupMetadata(to)
            await botwa.sendMessage(to, JSON.stringify(metadata))
        }

    }

}


// export class JoinGrupCommand extends Command {
//     key: string = '/join-grup';
//     replyMessageOnSuccess: string = 'udah masuk grup bro';

//     async cb(botwa: BotWa, message: proto.IWebMessageInfo): Promise<boolean> {
//         const receivedMessage = message.message?.conversation

//         const m1 = receivedMessage!.split(' ')[1]
//         if (await botwa.joinGroup(m1)) return true
//         return false
//     }
// }


