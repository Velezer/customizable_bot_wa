import { proto } from "@adiwajshing/baileys";
import { BaileysSock } from "./BaileysSock";
import { LegacyBaileysSock } from "./LegacyBaileysSock";



export class BotWa {
    sock: BaileysSock;
    constructor(sock: BaileysSock) {
        this.sock = sock
    }

    async sendMessage(to: string, message: string) {
        await this.sock.sendMessage(to, { text: message })
    }

    async sendMentioned(to: string) {
        return this.sock.generateMessageTag()
        // this.sock.sendMessage(to, {}, { quoted: })
    }

    async getGroupMetadata(to: string) {
        return await this.sock.groupMetadata(to)
    }

    async getGroupParticipants(to: string) {
        const metadata = await this.getGroupMetadata(to)
        const participants = await metadata.participants

        return participants
    }

    async isSentByAdmin(to: string, message: proto.IWebMessageInfo): Promise<boolean> {
        const sender = message.participant

        const participants = await this.getGroupParticipants(to)

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