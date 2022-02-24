import fs from 'fs'

export class OcedBot {
    static activationKeyFile: string = 'activation.key'



    static getActivationKey(): string {
        if (!fs.existsSync(this.activationKeyFile)) {
            throw new Error(this.activationKeyFile + " 404 alias ga ada");
        }
        const activationKey = fs.readFileSync(this.activationKeyFile, { encoding: 'utf-8' }) as unknown as string
        return activationKey
    }

    static generateActivationKey() {
        fs.writeFileSync(this.activationKeyFile, 'ocedkey')
    }


    static getPhoneNumber() {
        const file = 'oced.bot'
        if (!fs.existsSync(file)) {
            throw new Error(file + " 404 alias ga ada");
        }

        return fs.readFileSync(file)
    }
}