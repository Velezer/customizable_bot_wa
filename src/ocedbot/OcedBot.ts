import fs from 'fs'

function getRandomString(length:number) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

export class OcedBot {
    static activationKeyFile: string = 'activation.key'



    static getActivationKey(): string {
        if (!fs.existsSync(this.activationKeyFile)) {
            this.generateActivationKey()
        }
        const activationKey = fs.readFileSync(this.activationKeyFile, { encoding: 'utf-8' })
        return activationKey
    }

    static generateActivationKey() {
        fs.writeFileSync(this.activationKeyFile, getRandomString(15))
    }


    static getPhoneNumber() {
        const file = 'oced.bot'
        if (!fs.existsSync(file)) {
            throw new Error(file + " 404 alias ga ada");
        }

        return fs.readFileSync(file)
    }
}