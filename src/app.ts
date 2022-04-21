import { BotWa } from './botwa'
import { Activation } from './activation/activation'
import { BehaviorHandler } from './handlers/behavior.handler'
import { CommandHandler } from './handlers/command.handler'
import { LoggerOcedBot } from './logger'
import { CommandLevel } from './commands/interface'
import { AppDatabase } from './typeorm'
import { DataSource } from 'typeorm';
import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion, useSingleFileAuthState, WASocket } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import fs from 'fs'

import MAIN_LOGGER from '@adiwajshing/baileys/lib/Utils/logger'

const logger = MAIN_LOGGER.child({})
logger.level = 'warn'


export async function app(dataSource: DataSource) {
    const db = new AppDatabase(dataSource)
    await db.setup().then(() => console.log('db connected'))
    const services = db.getServices()


    const authName = process.env.AUTH_NAME!
    const foundAuth = await services.authService.findOne(authName)
    if (foundAuth && foundAuth.authInfo) {
        fs.writeFileSync('./auth_info_multi.json', foundAuth.authInfo);
    }

    const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')

    let sock: WASocket = makeWASocket({
        version: (await fetchLatestBaileysVersion()).version,
        auth: state,
        printQRInTerminal: true,
        logger,
        getMessage: async key => { return { conversation: 'ocedbot' } }
    })


    sock.ev.on('creds.update', async (creds) => {
        saveState()
        services.authService.set(authName, JSON.stringify(useSingleFileAuthState('./auth_info_multi.json').state))
    })

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
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
        if (receivedMessage.key.fromMe === true || !receivedMessage?.message) return

        const botwa = new BotWa(sock)

        const jid = receivedMessage.key.remoteJid!
        const isNotGroup = jid.split('@')[1] !== 'g.us'
        if (isNotGroup) return

        const participants = await botwa.getGroupParticipants(jid)

        const quotedMessage = receivedMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
        console.log('=============================================')
        console.log(receivedMessage.key.id)
        console.log(receivedMessage.message.extendedTextMessage?.contextInfo?.stanzaId)
        console.log(quotedMessage?.extendedTextMessage?.contextInfo?.stanzaId)
        console.log('=============================================')
        const conversation = receivedMessage.message?.conversation ||
            receivedMessage.message?.extendedTextMessage?.text ||
            receivedMessage.message?.listResponseMessage?.title ||
            receivedMessage.message?.buttonsResponseMessage?.selectedDisplayText ||
            receivedMessage.message.imageMessage?.caption

        if (!conversation) return

        if (jid === LoggerOcedBot.jid && conversation.startsWith('/key')) {
            const activation = new Activation()
            for (const k of activation.getActivationKey()) {
                await LoggerOcedBot.log(botwa, k.botLevel)
                await LoggerOcedBot.log(botwa, '/sewa ' + k.key)
            }
            return
        }

        const commander = new CommandHandler(botwa, services)
        const sentByAdmin = await commander.isSentByGroupAdmin(receivedMessage, participants)
        const commandLevel = sentByAdmin ? CommandLevel.ADMIN : CommandLevel.MEMBER

        try {
            commander.run(jid, conversation, commandLevel, quotedMessage!, receivedMessage, m.messages)
        } catch (err) {
            console.log(err)
        }

        if (jid === LoggerOcedBot.jid) {
            commander.unreg(conversation)
            commander.blacklist(conversation)
        }

    })

}
