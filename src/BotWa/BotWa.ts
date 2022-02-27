import { GroupSettingChange, MessageType, proto, WAConnection } from "@adiwajshing/baileys";



export class BotWa {
    sock: WAConnection;
    allowedJidGroup: string[] = [];

    constructor(sock: WAConnection) {
        this.sock = sock
    }
    async sendListMessageSingleSelect(to: string, title: string, sections: proto.ISection[]) {
        const listMessage: proto.ListMessage = {
            buttonText: 'Pencet BOS!',
            title,
            description: "silakan dipilih...",
            listType: proto.ListMessage.ListMessageListType.SINGLE_SELECT,
            sections,
            footerText: "by oced-bot",
            toJSON: function (): { [k: string]: any; } {
                throw new Error("Function not implemented.");
            }
        }
        return await this.sock.sendMessage(to, listMessage, MessageType.listMessage)
    }
    async sendListMessageProductList(to: string, sections: proto.ISection[]) {
        const listMessage: proto.ListMessage = {
            buttonText: 'Pencet BOS!',
            title: "Menu",
            description: "silakan dipilih...",
            listType: proto.ListMessage.ListMessageListType.PRODUCT_LIST,
            sections,
            footerText: "by oced-bot",
            toJSON: function (): { [k: string]: any; } {
                throw new Error("Function not implemented.");
            }
        }
        return await this.sock.sendMessage(to, listMessage, MessageType.listMessage)
    }

    async sendButtonMessage(to: string, contentText: string, footerText: string, messsages: string[]) {
        const buttons: proto.IButton[] = []
        messsages.forEach(m => {
            buttons.push(
                { buttonId: m + 'id', buttonText: { displayText: m }, type: proto.Button.ButtonType.RESPONSE },
            )
        })
        const buttonsMessage: proto.ButtonsMessage = {
            contentText,
            footerText,
            buttons,
            headerType: proto.ButtonsMessage.ButtonsMessageHeaderType.EMPTY,
            toJSON: function (): { [k: string]: any; } {
                throw new Error("Function not implemented.");
            }
        }
        this.sock.sendMessage(to, buttonsMessage, MessageType.buttonsMessage)
    }

    async getUserInfo() {
        return this.sock.user
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

    async getGroupSubject(jidGroup: string) {
        const subject = (await this.sock.groupMetadata(jidGroup)).subject
        return subject
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
                return await this.sock.groupDemoteAdmin(jidGroup, [p.jid])
            }
        }
    }
    async promote(jidGroup: string, phoneNumber: string) {
        phoneNumber += '@s.whatsapp.net'
        const participants = await this.getGroupParticipants(jidGroup)
        for (const p of participants) {
            if (p.jid.includes(phoneNumber)) {
                return await this.sock.groupMakeAdmin(jidGroup, [p.jid])
            }
        }
    }
}