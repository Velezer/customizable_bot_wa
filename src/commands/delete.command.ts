import { BotLevel } from "../groups/interface";
import { Command, CommandLevel, RunArgs } from "./interface";



export class DeleteBotTypoCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/delete';
    example: string = this.key;
    description: string = 'delete kalo bot nya typo';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat } = args
        const quotedMessageString = quotedMessage?.extendedTextMessage?.text || quotedMessage?.conversation
        await botwa.sock.findMessage(groupChat.jid, 50, (m) => {
            const foundMessageString = m.message?.conversation || m.message?.extendedTextMessage?.text
            if (m.key.fromMe === true) {
                if (quotedMessageString === foundMessageString) {
                    botwa.deleteMessage(m.key).catch(err => {
                        botwa.sendMessage(groupChat.jid, 'delete gagal')
                    })
                    return true
                }
            }

            return false
        })

    }

}