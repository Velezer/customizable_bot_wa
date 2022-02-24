import { GroupSettingChange, MessageType, proto, WAConnection } from "@adiwajshing/baileys";



export class BotWa {
    sock: WAConnection;
    allowedJidGroup: string[] = [];

    constructor(sock: WAConnection) {
        this.sock = sock
    }

    checkActivation(jidGroup: string): boolean {
        if (this.allowedJidGroup.includes(jidGroup)) return true
        return false
    }

    activate(jidGroup: string) {
        if (this.checkActivation(jidGroup)) return
        this.allowedJidGroup.push(jidGroup)
    }

    async sendMessage(to: string, message: string) {
        return await this.sock.sendMessage(to, message, MessageType.text)
    }

    async sendMentionedAll(to: string, m1: string) {
        const participants = await this.getGroupParticipants(to)
        const contacts = participants.map(p => p.jid)
        return await this.sock.sendMessage(to, m1, MessageType.extendedText, { contextInfo: { "mentionedJid": contacts } })
            .catch(err => console.log(err))
    }

    async getGroupMetadata(jidGroup: string) {
        const metadata = await this.sock.groupMetadata(jidGroup)
        return metadata
    }

    async getGroupParticipants(jidGroup: string) {
        const metadata = await this.getGroupMetadata(jidGroup)
        const participants = metadata.participants

        return participants
    }

    async openGroupSettings(jidGroup: string) {
        this.sock.groupSettingChange(jidGroup, GroupSettingChange.settingsChange, false)
    }

    async closeGroupSettings(jidGroup: string) {
        this.sock.groupSettingChange(jidGroup, GroupSettingChange.settingsChange, true)
    }

    async openGroupChat(jidGroup: string) {
        this.sock.groupSettingChange(jidGroup, GroupSettingChange.messageSend, false)
    }
    async closeGroupChat(jidGroup: string) {
        this.sock.groupSettingChange(jidGroup, GroupSettingChange.messageSend, true)
    }

    // async isSentByAdmin(jidGroup: string, message: proto.IWebMessageInfo): Promise<boolean> {
    //     // const sender = message.participant
    //     const sender = message.key.participant

    //     const participants = await this.getGroupParticipants(jidGroup)

    //     for (const p of participants) {

    //         if (p.jid === sender && p.isAdmin) return true
    //     }
    //     return false
    // }

    async joinGroup(link: string): Promise<string> {
        const response = await this.sock.acceptInvite(link)
        return response
    }

    async reply(to: string, message: string, from: proto.WebMessageInfo) {
        await this.sock.sendMessage(to, message, MessageType.text, { quoted: from })

    }

    async demote(jidGroup: string, phoneNumber: string) {
        phoneNumber += '@s.whatsapp.net'
        const participants = await this.getGroupParticipants(jidGroup)
        for (const p of participants) {
            if (p.jid.includes(phoneNumber)) {
                this.sock.groupDemoteAdmin(jidGroup, [p.jid])
            }
        }
    }
    async promote(jidGroup: string, phoneNumber: string) {
        phoneNumber += '@s.whatsapp.net'
        const participants = await this.getGroupParticipants(jidGroup)
        for (const p of participants) {
            if (p.jid.includes(phoneNumber)) {
                this.sock.groupMakeAdmin(jidGroup, [p.jid])
            }
        }
    }
}