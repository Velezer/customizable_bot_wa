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

            if (key === command.key && message.isGroupMsg == false) {
                const m0 = message.body.split(' ')[0]
                const m1 = message.body.split(' ')[1]
                const m2 = message.body.split(`${m0} ${m1} `)[1] 
                command.cb(m1, m2)

                console.log(this.commands)
                await client.reply(
                    message.chatId,
                    command.replyMessage,
                    message.id.toString()
                );
            }

        });


    }
}


