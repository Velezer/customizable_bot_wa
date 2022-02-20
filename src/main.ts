import * as venom from 'venom-bot';
import { commands } from './commands';
import { MessageListener } from './messages'

async function main() {
    const client = await venom.create(
        'global-bot',
        (base64Qrimg, asciiQR, attempts, urlCode) => {
            console.log('\n\n\n')
            console.log('base64 image string qrcode: ', base64Qrimg);
            console.log('\n\n\n')
        },
    )
        .then(client => {
            client.onAnyMessage(async message => {
                const mlistener = new MessageListener(message, client, commands)
                mlistener.run()
            })
        })
        .catch(err => {
            console.error('main function error')
            console.error(err)
        })


}


main()