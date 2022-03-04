import { proto } from '@adiwajshing/baileys';
import { Helper } from './helper/file';



export class OcedBot {
    private static ocedBotFile: string = 'oced.bot'
    private static receivedMessageFile: string = 'received.json'


    static getPhoneNumber() {
        const file = this.ocedBotFile
        if (!Helper.isExist(file)) {
            throw new Error(file + " 404 alias ga ada");
        }

        return Helper.readFile(file)
    }


    static saveReceivedMessage(receivedMessage: proto.WebMessageInfo) {
        if (!Helper.isExist(this.receivedMessageFile)) {
            Helper.saveJSON(this.receivedMessageFile, [receivedMessage])
            return
        }
        let data = this.readSavedReceivedMessage()
        data.push(receivedMessage)
        Helper.saveJSON(this.receivedMessageFile, data)
    }

    static readSavedReceivedMessage(): proto.WebMessageInfo[] {
        let data = Helper.readJSON(this.receivedMessageFile)
        if (!Array.isArray(data)) {
            data = []
        }
        return data
    }

    static findMessageKey(quotedMessageString: string, groupJid:string): proto.IMessageKey | undefined {
        const data = this.readSavedReceivedMessage().reverse()
        const found = data.find(d => d.message?.extendedTextMessage?.text === quotedMessageString && d.key.remoteJid === groupJid)

        return found?.key
    }

    static deleteReceivedMessage(msgKey: proto.IMessageKey) {
        const data = this.readSavedReceivedMessage().reverse()
        const found = data.findIndex(d => d.key === msgKey)
        if (found) {
            data.splice(found, 1)
            Helper.saveJSON(this.receivedMessageFile, data)
        }
    }
}