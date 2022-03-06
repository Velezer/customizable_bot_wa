import { proto } from "@adiwajshing/baileys";
import { BotWa } from "../../botwa";
import { GroupChat } from "../../groups/group.chat";
import { BotLevel } from "../../groups/interface";
import { Command, CommandLevel } from "../interface";


export class PromoteCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/promote';
    example: string = this.key + ' 0000000000';
    description: string = 'promote member grup';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(botwa: BotWa, groupChat: GroupChat, conversation: string, quotedMessage: proto.IMessage, receivedMessage: proto.WebMessageInfo): Promise<void> {
        let m1: string = ''
        if (quotedMessage) {
            const participant = receivedMessage.message?.extendedTextMessage?.contextInfo?.participant!
            m1 = participant.split('@')[0]

        } else {
            m1 = conversation.slice(this.key.length + 1)

            if (m1.startsWith('@')) {
                m1 = m1.slice(1)
            }
        }

        botwa.promote(groupChat.jid, m1)
            .catch(err => {
                botwa.sendMessage(groupChat.jid, 'promote gagal')
            })

    }

}