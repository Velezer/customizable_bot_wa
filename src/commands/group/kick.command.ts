import { BotLevel } from "../../groups/interface";
import { Command, CommandLevel, RunArgs } from "../interface";



export class KickCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/kick';
    example: string = this.key + ' 00000000';
    description: string = 'kick beban grup';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat } = args
        let m1: string = ''
        if (quotedMessage) {
            const participant = receivedMessage?.message?.extendedTextMessage?.contextInfo?.participant!
            m1 = participant.split('@')[0]

        } else {
            m1 = conversation.slice(this.key.length + 1)

            if (m1.startsWith('@')) {
                m1 = m1.slice(1)
            }
        }
        botwa.kick(groupChat!.jid, m1)
            .catch(() => {
                botwa.sendText(groupChat!.jid, 'kick gagal')
            })


    }

}
