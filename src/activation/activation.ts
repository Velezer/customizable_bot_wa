
import fs from 'fs'
import { BotLevel } from '../groups/interface';
import { Helper } from '../helper/helper';
import { ActivationKey } from './interface';
import { FileCacheService } from './../typeorm/service/FileCacheService';



export class Activation {
    activationKeyFile: string = 'activation.key'
    storage: FileCacheService = new FileCacheService()

    getActivationKey(): ActivationKey[] {
        if (!this.storage.get(this.activationKeyFile)) this.generateActivationKey()
        return this.storage.get(this.activationKeyFile)
    }

    generateActivationKey() {
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
        this.storage.set(this.activationKeyFile, activationKeys, 600_000)
    }

}