import { Message, Whatsapp } from 'venom-bot';
import { command } from './commands';

export class MessageListener {
    message: Message;
    client: Whatsapp;
    commands: command[];


    constructor(message: Message, client: Whatsapp, commands: any) {
        this.message = message
        this.client = client
        this.commands = commands

    }


    run() {
        const message = this.message
        const client = this.client

        this.commands.forEach(async command => {
            const key = message.body.split(' ')[0]
            if (
                key === command.key &&
                message.fromMe === false
            ) {

                command.cb(client, message)

                await client.reply(
                    message.chatId,
                    command.replyMessage,
                    message.id.toString()
                );
            }

        });


    }
}


