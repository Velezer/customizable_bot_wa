import { BotWa } from './BotWa/BotWa'
import { Commander } from './Commander'
import P from 'pino'
import makeWASocket, { AnyWASocket, DisconnectReason, makeWALegacySocket, useSingleFileAuthState, newLegacyAuthCreds, makeInMemoryStore, LegacyAuthenticationCreds, proto, generateWAMessage, fetchLatestBaileysVersion } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import { LegacyBaileysSock } from './BotWa/LegacyBaileysSock'
import { loadAuth, saveAuth } from './auth/auth'
import makeLegacySocket from '@adiwajshing/baileys/lib/LegacySocket'
import { BaileysSock } from './BotWa/BaileysSock'

const store = makeInMemoryStore({ logger: P().child({ level: 'debug', stream: 'store' }) })
store.readFromFile('./baileys_store_multi.json')



const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')

async function main() {
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)

    const sock: BaileysSock = makeWASocket({
        version,
        logger: P({ level: 'debug' }),
        printQRInTerminal: true,
        auth: state,
        getMessage: async key => {
            console.log('==============================')
            return {
                conversation: 'hello'
            }
        }
        // version: [2, 2202, 12]
    })

    store.bind(sock.ev)

    sock.ev.on('creds.update', saveState)

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
        const botwa = new BotWa(sock)
        const commander = new Commander(botwa, messages[0])

        commander.runCommands()
        commander.runBehaviors()
    })

}


main()