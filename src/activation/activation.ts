
import fs from 'fs'
import { BotLevel } from '../groups/interface';
import { ActivationKey } from './interface';

function getRandomString(length: number) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

export class Activation {
    static activationKeyFile: string = 'activation.key'

    static getActivationKey(): ActivationKey[] {
        if (!fs.existsSync(this.activationKeyFile)) {
            this.generateActivationKey()
        }
        const keyString = fs.readFileSync(this.activationKeyFile, { encoding: 'utf-8' })
        return JSON.parse(keyString)
    }

    static generateActivationKey() {
        const activationKeys: ActivationKey[] = [
            {
                key: getRandomString(15),
                botLevel: BotLevel.BASIC
            },
            {
                key: getRandomString(15),
                botLevel: BotLevel.ELEGANT
            }
        ]
        fs.writeFileSync(this.activationKeyFile, JSON.stringify(activationKeys))
    }

}