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


// export class TagAllCommand extends Command {
//     key: string = '/tag-all';
//     replyMessageOnSuccess: string = '';

//     async cb(botwa: BotWa, message: proto.IWebMessageInfo): Promise<boolean> {
//         const receivedMessage = message.message?.conversation
//         const m1 = receivedMessage!.split('/tag-all ')[1]
//         const to = message.key.remoteJid


//         if (message.participant) {
//             const groupId = 'message.chatId'
//             // await botwa.sendMentioned(groupId, m1, [])
//             return false
//         } else {
//             botwa.sendMessage(to!, `${this.key} cuma bisa di grup`)
//             return false
//         }
//         return false
//     }

// }