import { Whatsapp, Message } from "venom-bot";
import { Command } from "./Command";


export class TagAllCommand extends Command {
    key: string = '/tag-all';
    replyMessageOnSuccess: string = 'tag semua nih';

    async cb(client: Whatsapp, message: Message): Promise<boolean> {
        if (message.isGroupMsg) {
            const groupId = message.chatId
            const groupMembers = await client.getGroupMembersIds(groupId)
            await client.sendMentioned(groupId, '', groupMembers.map(member => member.id))
            return true
        } else {
            client.reply(message.chatId, `${this.key} cuma bisa di grup`, message.id)
            return false
        }
    }

}