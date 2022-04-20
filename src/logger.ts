import { BotWa } from "./botwa";


export class LoggerOcedBot {

    static jid = process.env.LOGGER_JID

    static log(botwa: BotWa, message: string) {
        return botwa.sendText(this.jid!, message)
    }

}
