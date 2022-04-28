
import { BotLevel } from '../groups/interface';
import { ActivationKey } from './interface';
import { getRandomString } from '../utils';
import { KVF } from 'kvfiledb';



export class Activation {
    activationKeyFile: string = 'activation.key'
    storage: KVF = new KVF('__activation__')

    getActivationKey(): ActivationKey[] {
        if (!this.storage.get(this.activationKeyFile)) this.generateActivationKey()
        return this.storage.get(this.activationKeyFile)
    }

    generateActivationKey() {
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
        this.storage.set(this.activationKeyFile, activationKeys, 600_000)
    }

}