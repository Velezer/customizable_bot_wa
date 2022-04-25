
import { BotLevel } from '../groups/interface';
import { ActivationKey } from './interface';
import { FileCacheService } from './../typeorm/service/FileCacheService';
import { getRandomString } from '../utils';



export class Activation {
    activationKeyFile: string = 'activation.key'
    storage: FileCacheService = new FileCacheService('__activation__')

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