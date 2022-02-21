import { Whatsapp, Message } from "venom-bot";
import { Command } from "./Command";



export class CekCommand extends Command {
    key: string = '/cek';
    replyMessageOnSuccess: string = 'bot sudah aktif';

    async cb(client: Whatsapp, message: Message): Promise<boolean> {
        return true
    }
}


export class JoinGrupCommand extends Command {
    key: string = '/join-grup';
    replyMessageOnSuccess: string = 'udah masuk grup bro';
    
    async cb(client: Whatsapp, message: Message): Promise<boolean> {
        const m1 = message.body.split(' ')[1]
        if (await client.joinGroup(m1)) return true
        return false
    }
}


export class TagAllCommand extends Command {
    key: string = '/tag-all';
    replyMessageOnSuccess: string = '';

    async cb(client: Whatsapp, message: Message): Promise<boolean> {
        const m1 = message.body.split('/tag-all ')[1]

        if (message.isGroupMsg) {
            const groupId = message.chatId
            const groupMembers = await client.getGroupMembersIds(groupId)
            console.log(groupMembers)
            console.log(groupMembers.map(member => member.user))
            await client.sendMentioned(groupId, m1, groupMembers.map(member => member.user))
            return true
        } else {
            client.reply(message.chatId, `${this.key} cuma bisa di grup`, message.id)
            return false
        }
    }

}