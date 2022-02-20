import * as venom from 'venom-bot';
import { commands } from './commands';
import { MessageListener } from './messages'


venom
    .create(
        'global-bot',
        (base64Qrimg, asciiQR, attempts, urlCode) => {
            console.log('Terminal qrcode: ', asciiQR);
            console.log('\n\n\n')
            console.log('base64 image string qrcode: ', base64Qrimg);
            console.log('\n\n\n')
            console.log('urlCode (data-ref): ', urlCode);
            console.log('\n\n\n')
        },
    )
    .then((client) => {
        client.onAnyMessage(async message => {
            const mlistener = new MessageListener(message, client, commands)
            mlistener.run()
        })
    })
    .catch((error) => console.log(error));