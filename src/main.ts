import { createConnection, QueryFailedError } from 'typeorm';
import * as venom from 'venom-bot';
import { Commander } from './Commander'
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.dev.local' })


async function main() {
    const sessionName = 'global-bot'

    venom.create(
        sessionName,
        (base64Qrimg, asciiQR, attempts, urlCode) => {
            console.log('\n\n\n')
            console.log('base64 image string qrcode: ', base64Qrimg);
            console.log('\n\n\n')
        },
        undefined,
        { browserArgs: ['--no-sandbox']},
    )
        .then(async client => {
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