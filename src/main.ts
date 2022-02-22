import { BotWa } from './BotWa/BotWa'
import { Commander } from './Commander'
import makeWASocket, { DisconnectReason, makeWALegacySocket, useSingleFileAuthState, newLegacyAuthCreds, makeInMemoryStore, LegacyAuthenticationCreds, proto } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import { LegacyBaileysSock } from './BotWa/LegacyBaileysSock'
import { loadAuth, saveAuth } from './auth/auth'

async function main() {

    const sock: LegacyBaileysSock = makeWALegacySocket({
        printQRInTerminal: true,
        // auth: authData
    })

    sock.ev.on('creds.update', saveAuth)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect!.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut

            if (shouldReconnect) {
                main()
            }

        } else if (connection === 'open') {
            console.log('opened connection')
        }
    })


    sock.ev.on('messages.upsert', async ({ messages }) => {
        console.log(messages[0])
        const botwa = new BotWa(sock)
        const commander = new Commander(botwa, messages[0])

        commander.runCommands()
        commander.runBehaviors()
    })

}


main()