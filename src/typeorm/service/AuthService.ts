
import { Repository } from 'typeorm';
import { AuthEntity } from '../entity/AuthEntity';


export class AuthService {
    private repo: Repository<AuthEntity>;
    constructor(repo: Repository<AuthEntity>) {
        this.repo = repo
    }

    async findOne(name: string) {
        const found = await this.repo.findOneBy({name})
        return found
    }

    async create(name: string, authInfo: string) {
        return this.repo.save(this.repo.create({name, authInfo}))
    }

    async remove(name: string) {
        return this.repo.delete({ name })
    }

}