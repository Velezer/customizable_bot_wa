
import { Repository } from 'typeorm';
import { AuthEntity } from '../entity/AuthEntity';


export class AuthService {
    private repo: Repository<AuthEntity>;
    constructor(repo: Repository<AuthEntity>) {
        this.repo = repo
    }

    async findOne(name: string) {
        const found = await this.repo.findOneBy({ name })
        return found
    }

    async set(name: string, authInfo: string) {
        let found = await this.findOne(name)

        if (found) found!.authInfo = authInfo
        else found = this.repo.create({ name, authInfo })

        return this.repo.save(found!)
    }

    async remove(name: string) {
        return this.repo.delete({ name })
    }

}