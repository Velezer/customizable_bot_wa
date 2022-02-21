import { Message, Whatsapp } from 'venom-bot';
import { Command } from './Command/Command';
import { CekCommand, JoinGrupCommand, TagAllCommand } from './Command/commands';

export class Commander {
    message: Message;
    client: Whatsapp;
    commands: Command[];


    constructor(message: Message, client: Whatsapp) {
        this.message = message
        this.client = client
        this.commands = [
            new CekCommand(),
            new TagAllCommand(),
            new JoinGrupCommand()
        ]

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

                if (await command.cb(client, message)) {
                    await client.reply(
                        message.chatId,
                        command.replyMessageOnSuccess,
                        message.id.toString()
                    );
                }


            }

        });


    }
}


