import { BotWa } from "../BotWa/BotWa";


export class LoggerOcedBot {

    static jid = '120363038925650049@g.us'

    static log(botwa: BotWa, message: string) {
        botwa.sendMessage(this.jid, message)
    }

    // static _test(botwa: BotWa){
    //     botwa.sendListMessage('120363038925650049@g.us')
    // }
    static saveReceivedMessage(receivedMessage){
    saveJSON('received.json',receivedMessage)
}

    static readSavedReceivedMessage(){
    const data = readFile('received.json')
    return data
}

    static findMessageKey(message:string): proto.IMessageKey{
    const data = this.readSavedReceivedMessage()
    data.find(d=>d.message === message)
}

}
