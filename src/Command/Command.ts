import { Message, Whatsapp } from "venom-bot"


export abstract class Command {
    abstract key: string

    abstract replyMessageOnSuccess: string

    abstract cb(client: Whatsapp, message: Message): Promise<boolean>
}