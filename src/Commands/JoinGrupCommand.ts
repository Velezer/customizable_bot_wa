import { Whatsapp, Message } from "venom-bot";
import { Command } from "./Command"


export class JoinGrupCommand extends Command {
    key: string = '/join-grup';
    replyMessageOnSuccess: string = 'udah masuk grup bro';
    
    async cb(client: Whatsapp, message: Message): Promise<boolean> {
        const m1 = message.body.split(' ')[1]
        if (await client.joinGroup(m1)) return true
        return false
    }
}