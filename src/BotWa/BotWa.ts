import { proto } from "@adiwajshing/baileys";
import { LegacyBaileysSock } from "./LegacyBaileysSock";



export class BotWa {
    sock: LegacyBaileysSock;
    constructor(sock: LegacyBaileysSock) {
        this.sock = sock
    }

    async sendMessage(to: string, message: string) {
        await this.sock.sendMessage(to, { text: message })
    }

    async sendMentioned(to: string, message: string, contacts: string[]) {
        // this.sock.sendMessage(to, {}, { quoted: })
    }

    async getGroupMetadata(to: string) {
        return await this.sock.groupMetadata(to, false)
    }

    // async joinGroup(link: string): Promise<string> {
    //     // const response = await this.sock.groupAcceptInvite(link)
    //     return 'response'
    // }

    async reply(to: string, message: string, from: proto.IWebMessageInfo) {
        await this.sock.sendMessage(to, { text: message }, { quoted: from })

    }
}