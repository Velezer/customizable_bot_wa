import { Whatsapp, Message } from "venom-bot";
import { Command } from "./Command";



export class CekCommand extends Command {
    key: string = '/cek';
    replyMessageOnSuccess: string = 'bot sudah aktif';

    async cb(client: Whatsapp, message: Message): Promise<boolean> {
        return true
    }
}