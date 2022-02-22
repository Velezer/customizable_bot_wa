import { LegacyBaileysSock } from "./LegacyBaileysSock";



export class BotWa {
    sock: LegacyBaileysSock;
    constructor(sock: LegacyBaileysSock) {
        this.sock = sock
    }

    async sendMessage(to: string, message: string) {
        await this.sock.sendMessage(to, { text: message })
    }

    // async sendMentioned(to: string, message: string, contacts: string[]) {
    // }

    // async joinGroup(link: string): Promise<string> {
    //     // const response = await this.sock.groupAcceptInvite(link)
    //     return 'response'
    // }

    // async reply(to: string, message: string, from: string) {

    // }
}