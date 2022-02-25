import { BotWa } from './BotWa/BotWa'
import { Commander } from './Commander'
import makeWASocket, { DisconnectReason, proto, ReconnectMode, WAConnection } from '@adiwajshing/baileys'
import * as auth from './auth/auth'
import { GroupManager } from './groups/GroupManager'
import { OcedBot } from './ocedbot/OcedBot'



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

    sock.on('chat-update', async (message) => {
        const botwa = new BotWa(sock)
        const commander = new Commander(botwa, message)

        commander.runCommands()
        commander.runBehaviors()
    })

}


main()   