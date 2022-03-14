import { Helper } from './helper/helper';



export class OcedBot {
    private static ocedBotFile: string = 'oced.bot'

    static getPhoneNumber() {
        const file = this.ocedBotFile
        if (!Helper.isExist(file)) {
            throw new Error(file + " 404 alias ga ada");
        }

        return Helper.readFile(file)
    }

}