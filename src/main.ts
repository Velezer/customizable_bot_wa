import { createConnection, QueryFailedError } from 'typeorm';
import * as venom from 'venom-bot';
import { Commander } from './Commander'


async function main() {
    const sessionName = 'global-bot'

    venom.create(
        sessionName,
        (base64Qrimg, asciiQR, attempts, urlCode) => {
        },
        undefined,
        { browserArgs: ['--no-sandbox', '--disable-gpu'] },
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