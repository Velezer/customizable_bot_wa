import { BotWa } from "../BotWa/BotWa";


export class LoggerOcedBot {

    static log(botwa: BotWa, message: string) {
        botwa.sendMessage('120363038925650049@g.us', message)
    }
    static _test(botwa: BotWa) {
        botwa.sendButtonMessage('120363038925650049@g.us')
    }
}