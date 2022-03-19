
import fs from 'fs'
import { BotLevel } from '../groups/interface';
import { Helper } from '../helper/helper';
import { ActivationKey } from './interface';



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
                key: Helper.getRandomString(15),
                botLevel: BotLevel.BASIC
            },
            {
                key: Helper.getRandomString(15),
                botLevel: BotLevel.ELEGANT
            }
        ]
        fs.writeFileSync(this.activationKeyFile, JSON.stringify(activationKeys))
    }

}