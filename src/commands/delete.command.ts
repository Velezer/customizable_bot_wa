import { BotWa } from "../botwa";
import { GroupChat } from "../groups/group.chat";
import { BotLevel } from "../groups/interface";
import { proto } from "@adiwajshing/baileys";
import { OcedBot } from "../ocedbot";
import { Command, CommandLevel } from "./interface";



export class DeleteBotTypoCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/delete';
    example: string = this.key;
    description: string = 'delete kalo bot nya typo';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string, quotedMessage: proto.IMessage): Promise<void> {
        const quotedMessageString = quotedMessage.extendedTextMessage?.text
        try {
            await botwa.sock.findMessage(groupChat.jid, 20, (m) => {
                const foundMessageString = m.message?.conversation || m.message?.extendedTextMessage?.text
                if(m.key.fromMe === true){
                    if (quotedMessageString === foundMessageString) {
                        console.log('=================')
                        console.log(quotedMessageString)
                        console.log('=================')
                        console.log(foundMessageString)
                        console.log('=================')
                        console.log(m)
                        console.log('=================')
                        botwa.deleteMessage(m.key)
                        return true
                    }
                }
                
                return false
            })
        } catch (err) {
            const msgKey: proto.IMessageKey = OcedBot.findMessageKey(quotedMessageString!, groupChat.jid)!

            botwa.deleteMessage(msgKey!)
                .then(() => {
                    OcedBot.deleteReceivedMessage(msgKey!)
                })
                .catch(err => {
                    botwa.sendMessage(groupChat.jid, 'delete gagal')
                })
        }


    }

}