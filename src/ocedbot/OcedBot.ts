import fs from 'fs'



export class OcedBot {
   

    static getPhoneNumber() {
        const file = 'oced.bot'
        if (!fs.existsSync(file)) {
            throw new Error(file + " 404 alias ga ada");
        }

        return fs.readFileSync(file)
    }
}