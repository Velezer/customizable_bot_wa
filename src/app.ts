import { BotWa } from './botwa'
import { Activation } from './activation/activation'
import { BehaviorHandler } from './handlers/behavior.handler'
import { CommandHandler } from './handlers/command.handler'
import { LoggerOcedBot } from './logger'
import { CommandLevel } from './commands/interface'
import { AppDatabase } from './typeorm'
import { DataSource } from 'typeorm';
import makeWASocket, { AuthenticationState, DisconnectReason, fetchLatestBaileysVersion, WASocket } from '@adiwajshing/baileys'
import MAIN_LOGGER from '@adiwajshing/baileys/lib/Utils/logger'
import { Boom } from '@hapi/boom'

const logger = MAIN_LOGGER.child({ })
logger.level = 'trace'

export async function app(dataSource: DataSource) {
    const db = new AppDatabase(dataSource)
    db.setup()
        .then(() => console.log('db connected'))
    const services = db.getServices()


    // let state: AuthenticationState | undefined = undefined
    // const authName = process.env.AUTH_NAME!
    // const foundAuth = await services.authService.findOne(authName)
    // if (foundAuth) {
    //     state = JSON.parse(foundAuth?.authInfo)
    // }

    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)

    let sock: WASocket = makeWASocket({
        version,
        logger,
        // auth: state,
        printQRInTerminal: true,
        getMessage: async key => { return { conversation: 'ocedbot' } }
    })


    // sock.ev.on('creds.update', async (creds) => {
    //     await services.authService.remove(authName)
    //     services.authService.create(authName, JSON.stringify(state))
    // })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if (shouldReconnect) {
                app(dataSource)
            }
        } else if (connection === 'open') {
            LoggerOcedBot.log(new BotWa(sock), "bot is started...");
        }
    })


    sock.ev.on('group-participants.update', async (groupUpdate) => {
        const groupJid = groupUpdate.id
        const action = groupUpdate.action
        const participants = groupUpdate.participants

        const botwa = new BotWa(sock)

        const participant = participants[0]


        const behaviorer = new BehaviorHandler(botwa, services)
        behaviorer.run(action, groupJid, participant)

    })

    sock.ev.on('messages.upsert', async (m) => {
        const receivedMessage = m.messages[0]!
        // console.log(receivedMessage)
        if (receivedMessage.key.fromMe === true || !receivedMessage?.message) return


        const botwa = new BotWa(sock)

        if (receivedMessage.message?.conversation?.startsWith('/key')) {
            Activation.getActivationKey().forEach(k => {
                LoggerOcedBot.log(botwa, k.botLevel)
                LoggerOcedBot.log(botwa, '/sewa ' + k.key)
            })
            return
        }

        const jid = receivedMessage.key.remoteJid!
        const isNotGroup = jid.split('@')[1] !== 'g.us'
        if (isNotGroup) return

        const participants = await botwa.getGroupParticipants(jid)

        const quotedMessage = receivedMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
        const conversation = receivedMessage.message?.conversation ||
            receivedMessage.message?.extendedTextMessage?.text ||
            receivedMessage.message?.listResponseMessage?.title ||
            receivedMessage.message?.buttonsResponseMessage?.selectedDisplayText ||
            receivedMessage.message.imageMessage?.caption

        if (!conversation) return

        const commander = new CommandHandler(botwa, services)
        if (! await commander.isSentByGroupAdmin(receivedMessage, participants)) {
            await commander.run(jid, conversation, CommandLevel.MEMBER, quotedMessage!, receivedMessage).catch(err => console.error(err))
            return
        }


        try {
            commander.run(jid, conversation, CommandLevel.ADMIN, quotedMessage!, receivedMessage).catch(err => console.error(err))
        } catch (err) {
            console.log(err)
        }

        if (jid === LoggerOcedBot.jid) {
            commander.unreg(conversation)
            commander.blacklist(conversation)
        }

    })

}
