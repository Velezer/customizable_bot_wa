import { LegacySocketConfig, makeInMemoryStore, WALegacySocket, AnyWASocket, proto } from "@adiwajshing/baileys";
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

        const quotedId = receivedMessage?.message?.extendedTextMessage?.contextInfo?.stanzaId
        const quotedKey: proto.IMessageKey = {
            id: quotedId,
            fromMe: true,
            remoteJid: jid
        }

        botwa.deleteMessage(jid, quotedKey).catch(err => {
            botwa.sendText(groupChat!.jid, 'delete gagal')
        })
    }

}