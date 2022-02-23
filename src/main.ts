import { BotWa } from './BotWa/BotWa'
import { Commander } from './Commander'
import makeWASocket, { DisconnectReason, proto, WAConnection } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'




async function main() {
    const sock: WAConnection = new WAConnection()
    sock.logger.level = 'debug'
    sock.version = [2, 2143, 3]


    sock.on('chat-update', async (message) => {
        const botwa = new BotWa(sock)
        const commander = new Commander(botwa, message)

        commander.runCommands()
        commander.runBehaviors()
    })

}


main()