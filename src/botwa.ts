import { downloadContentFromMessage, MiscMessageGenerationOptions, proto, WASocket } from "@adiwajshing/baileys";
import axios from "axios";


export class BotWa {
    sock: WASocket;

    constructor(sock: WASocket) {
        this.sock = sock
    }
    async downloadContentFromImgMsg(imgMsg: proto.IImageMessage): Promise<Buffer> {
        const stream = await downloadContentFromMessage({ mediaKey: imgMsg.mediaKey!, directPath: imgMsg.directPath!, url: imgMsg.url! }, 'image')
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    }

    sendVideoDocument(jid: string, video: Buffer, fileName: string) {
        return this.sock.sendMessage(jid, { document: video, mimetype: 'video/mp4', fileName })
    }
    sendSticker(jid: string, sticker: Buffer) {
        return this.sock.sendMessage(jid, { sticker })
    }
    sendImage(jid: string, image: Buffer, mentionedJid?: string[]) {
        return this.sock.sendMessage(jid, { image, mentions: mentionedJid })
    }

    deleteMessage(jid: string, msgKey: proto.IMessageKey) {
        return this.sock.sendMessage(jid, { delete: msgKey })
    }

    /**
     * Get the profile picture buffer of a person/group
     * @param participantJid 
     */
    async getProfilePictureBuffer(participantJid: string): Promise<Buffer> {
        const url = await this.sock.profilePictureUrl(participantJid, 'image')
        const buffer = await this.getBufferFromUrl(url)
        return buffer
    }
    async getBufferFromUrl(url: string): Promise<Buffer> {
        const res = await axios({
            method: "get",
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            responseType: 'arraybuffer'
        })
        return res.data
    }
    async sendSections(jid: string, title: string, sections: proto.ISection[]) {
        return this.sock.sendMessage(jid, { title, sections, text: '' })
    }

    sendButtonMessage(jid: string, image: Buffer, text: string, messsages: string[] = [], mentionedJid: string[]) {
        const buttons: proto.IButton[] = []
        messsages.forEach(m => {
            buttons.push(
                { buttonId: m + 'id', buttonText: { displayText: m }, type: proto.Button.ButtonType.RESPONSE },
            )
        })
        return this.sock.sendMessage(jid, { buttons, text, image, mentions: mentionedJid })
    }

    async getUserInfo() {
        return this.sock.user
    }

    sendText(jid: string, text: string, options?: MiscMessageGenerationOptions) {
        return this.sock.sendMessage(jid, { text }, options)
    }

    sendMentioned(jid: string, text: string, mentionedJid: string[]) {
        return this.sock.sendMessage(jid, { text, mentions: mentionedJid })
    }

    async sendMentionedAll(jid: string, m1: string) {
        const participants = await this.getGroupParticipants(jid)
        const contacts = participants.map(p => p.id)
        return await this.sock.sendMessage(jid, { text: m1, mentions: contacts })
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

    openGroupSettings(jidGroup: string) {
        return this.sock.groupSettingUpdate(jidGroup, 'unlocked')
    }

    closeGroupSettings(jidGroup: string) {
        return this.sock.groupSettingUpdate(jidGroup, 'locked')
    }

    openGroupChat(jidGroup: string) {
        return this.sock.groupSettingUpdate(jidGroup, 'not_announcement')
    }
    closeGroupChat(jidGroup: string) {
        return this.sock.groupSettingUpdate(jidGroup, 'announcement')
    }


    async reply(jid: string, text: string, from: proto.IWebMessageInfo) {
        await this.sock.sendMessage(jid, { text }, { quoted: from })
    }

    async demote(jidGroup: string, phoneNumber: string) {
        phoneNumber += '@s.whatsapp.net'
        const participants = await this.getGroupParticipants(jidGroup)
        for (const p of participants) {
            if (p.id.includes(phoneNumber)) {
                return await this.sock.groupParticipantsUpdate(jidGroup, [p.id], 'demote')
            }
        }
    }
    async promote(jidGroup: string, phoneNumber: string) {
        phoneNumber += '@s.whatsapp.net'
        const participants = await this.getGroupParticipants(jidGroup)
        for (const p of participants) {
            if (p.id.includes(phoneNumber)) {
                return await this.sock.groupParticipantsUpdate(jidGroup, [p.id], 'promote')
            }
        }
    }

    kick(jidGroup: string, phoneNumber: string) {
        return this.sock.groupParticipantsUpdate(jidGroup, [phoneNumber + '@s.whatsapp.net'], 'remove')
    }
}