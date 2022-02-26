import { BotWa } from './BotWa/BotWa'
import { Commander } from './Commander'
import { ReconnectMode, WAConnection } from '@adiwajshing/baileys'
import * as auth from './auth/auth'
import { OcedBot } from './ocedbot/OcedBot'
import { LoggerOcedBot } from './logger/Logger'



async function main() {
    const sock: WAConnection = new WAConnection()
    sock.logger.level = 'debug'
    sock.version = [2, 2143, 3]
    sock.browserDescription = ['velezer', 'Chrome', 'OcedBot']
    sock.autoReconnect = ReconnectMode.onAllErrors

    if (auth.isExist('auth.json')) {
        sock.loadAuthInfo('auth.json')
    }

    await sock.connect()
    auth.saveAuth('auth.json', sock.base64EncodedAuthInfo())

    sock.on('chat-update', async (chatUpdate) => {
        if (!chatUpdate.hasNewMessage) return
        const receivedMessage = chatUpdate.messages?.all()[0]!
        if (receivedMessage.key.fromMe === true) return
        if (!receivedMessage?.message) return

        const botwa = new BotWa(sock)

        if (receivedMessage.message?.conversation?.startsWith('/key')) {
            LoggerOcedBot.log(botwa, '/sewa ' + OcedBot.getActivationKey())
            return
        }

        const commander = new Commander(botwa, chatUpdate)
        commander.runCommands(receivedMessage)
        commander.runBehaviors()
    })

}

function run() {
    main()
        .catch(err => {
            console.error(err)
            main()
        })
}


run()