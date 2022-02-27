import { BotWa } from "../BotWa/BotWa";


export class LoggerOcedBot {

    static jid = '120363038925650049@g.us'

    static log(botwa: BotWa, message: string) {
        botwa.sendMessage(this.jid, message)
    }

    // static _test(botwa: BotWa){
    //     botwa.sendListMessage('120363038925650049@g.us')
    // }

}