import fs from 'fs'

export class OcedBot {
    static activationKeyFile: string = 'activation.key'

    static getPhoneNumber() {
        if (!fs.existsSync('oced.bot')) {
            throw new Error("oced.bot ga ada");
        }

        return fs.readFileSync('oced.bot')
    }

    static getActivationKey() {
        const activationKey = fs.readFileSync(this.activationKeyFile) as unknown as string
        return activationKey
    }

    static generateActivationKey() {
        fs.writeFileSync(this.activationKeyFile, 'ocedkey')
    }

}