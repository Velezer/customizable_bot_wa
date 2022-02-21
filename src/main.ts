import { createConnection, QueryFailedError } from 'typeorm';
import * as venom from 'venom-bot';
import { Commander } from './Commander'
import { Token } from './Token/token.entity';
import { TokenRepo } from './Token/token.repo';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.dev.local' })


async function main() {
    const connection = await createConnection({
        type: "postgres",
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT!,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DBNAME,
        entities: [Token],
        synchronize: true
    });

    const tokenRepo = connection.getCustomRepository(TokenRepo)

    const sessionName = 'global-bot'
    const foundToken = await tokenRepo.findBySessionName(sessionName)

    venom.create(
        sessionName,
        (base64Qrimg, asciiQR, attempts, urlCode) => {
            console.log('\n\n\n')
            console.log('base64 image string qrcode: ', base64Qrimg);
            console.log('\n\n\n')
        },
        undefined,
        undefined,
        foundToken?.session
    )
        .then(async client => {
            const token = new Token()
            token.sessionName = sessionName
            token.session = await client.getSessionTokenBrowser()
            try {
                tokenRepo.save(token)
            } catch (err) {
                if (err instanceof QueryFailedError) {
                    tokenRepo.update(token.id, token)
                }
            }

            client.onAnyMessage(async message => {
                const mlistener = new Commander(message, client)
                mlistener.run()
            })
        })
        .catch(err => {
            console.error('main function error')
            console.error(err)
        })


}


main()