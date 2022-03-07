
import fs from 'fs'

export class Helper {

    static saveJSON(file: string, data: any) {
        fs.writeFileSync(file, JSON.stringify(data, null, '\t'))
    }

    static isExist(file: string): boolean {
        return fs.existsSync(file)
    }

    static readFile(file: string) {
        return fs.readFileSync(file, { encoding: 'utf8' })
    }
    static readJSON(file: string) {
        return JSON.parse(this.readFile(file))
    }

    static getRandomString(length: number) {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

}