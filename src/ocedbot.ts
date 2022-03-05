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

}