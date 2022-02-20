import * as venom from 'venom-bot';
import { Commander } from './Commander'


async function main() {
    // const foundToken = {}
    venom.create(
        'global-bot',
        (base64Qrimg, asciiQR, attempts, urlCode) => {
            console.log('\n\n\n')
            console.log('base64 image string qrcode: ', base64Qrimg);
            console.log('\n\n\n')
        },
        undefined,
        undefined,
        undefined
    )
        .then(client => {
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