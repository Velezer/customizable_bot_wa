import { BotWa } from "./botwa";


export class LoggerOcedBot {

    static jid = '120363038925650049@g.us'

    static log(botwa: BotWa, message: string) {
        botwa.sendMessage(this.jid, message)
    }

}
