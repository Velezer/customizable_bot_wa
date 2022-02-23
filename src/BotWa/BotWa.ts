import { proto } from "@adiwajshing/baileys";
import { BaileysSock } from "./BaileysSock";
import { LegacyBaileysSock } from "./LegacyBaileysSock";



export class BotWa {
    sock: BaileysSock;
    constructor(sock: BaileysSock) {
        this.sock = sock
    }

    async sendMessage(to: string, message: string) {
        await this.sock.sendMessage(to, { text: message})
    }

    async sendMentioned(to: string) {
        return this.sock.generateMessageTag()
        // this.sock.sendMessage(to, {}, { quoted: })
    }

    async getGroupMetadata(jidGroup: string) {
        return await this.sock.groupMetadata(jidGroup)
    }

    async getGroupParticipants(jidGroup: string) {
        const metadata = await this.getGroupMetadata(jidGroup)
        const participants = await metadata.participants

        return participants
    }

    async isSentByAdmin(jidGroup: string, message: proto.IWebMessageInfo): Promise<boolean> {
        // const sender = message.participant
        const sender = message.key.participant

        const participants = await this.getGroupParticipants(jidGroup)

        for (const p of participants) {
            if (p.id === sender && p.admin?.endsWith('admin')) return true
        }
        return false
    }

    // async joinGroup(link: string): Promise<string> {
    //     // const response = await this.sock.groupAcceptInvite(link)
    //     return 'response'
    // }

    async reply(to: string, message: string, from: proto.IWebMessageInfo) {
        await this.sock.sendMessage(to, { text: message }, { quoted: from })

    }
}