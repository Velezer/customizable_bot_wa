import { LegacySocketConfig, makeInMemoryStore, WALegacySocket, AnyWASocket } from "@adiwajshing/baileys";
import { BotLevel } from "../groups/interface";
import { Command, CommandLevel, RunArgs } from "./interface";

export class DeleteBotTypoCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/delete';
    example: string = this.key;
    description: string = 'delete kalo bot nya typo';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat, messages } = args
        const jid = groupChat?.jid!

        const quotedMessageString = quotedMessage?.extendedTextMessage?.text || quotedMessage?.conversation

        const store = makeInMemoryStore({})
        const msg = await store.loadMessage(jid, quotedMessage?.extendedTextMessage?.contextInfo?.stanzaId!, botwa.sock as AnyWASocket as WALegacySocket)

        const foundMessageString = msg.message!.conversation || msg.message!.extendedTextMessage?.text
        if (msg.key.fromMe === true) {
            if (quotedMessageString === foundMessageString) {
                botwa.deleteMessage(jid, msg.key).catch(err => {
                    botwa.sendText(groupChat!.jid, 'delete gagal')
                })
            }
        }
    }

}