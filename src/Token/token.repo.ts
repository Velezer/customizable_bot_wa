import { EntityRepository, Repository } from "typeorm";
import { Token } from "./token.entity";

@EntityRepository(Token)
export class TokenRepo extends Repository<Token> {
    findBySessionName(sessionName: string) {
        return this.findOne({ sessionName })
    }

}