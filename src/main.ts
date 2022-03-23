require('dotenv').config()
import { BotWa } from './botwa'
import { ReconnectMode, WAConnection } from '@adiwajshing/baileys'
import { Activation } from './activation/activation'
import { BehaviorHandler } from './handlers/behavior.handler'
import { CommandHandler } from './handlers/command.handler'
import { LoggerOcedBot } from './logger'
import { CommandLevel } from './commands/interface'
import { AppDatabase } from './typeorm'
import { DataSources } from './typeorm/data-source'



async function main() {
    const db = new AppDatabase(DataSources.betterSqlite3)
    db.setup()
        .then(() => console.log('db connected'))
        .catch(err => console.log(err))
    const services = db.getServices()
    const sock: WAConnection = new WAConnection()
    sock.logger.level = 'debug' //''debug', 'fatal', 'error',  'trace'
    sock.version = [2, 2143, 3]
    sock.browserDescription = ['velezer', 'Chrome', 'OcedBot']
    sock.autoReconnect = ReconnectMode.onAllErrors

    const authName = process.env.AUTH_NAME
    const foundAuth = await services.authService.findOne(authName!)
    if (foundAuth) {
        sock.loadAuthInfo(foundAuth.authInfo)
    }

    await sock.connect()
    services.authService.create(authName!, JSON.stringify(sock.base64EncodedAuthInfo()))


    sock.on('close', async (data) => {
        console.log(data)
        if (data.isReconnecting === false) {
            main()
        }

    })
    sock.on('group-participants-update', async (groupUpdate) => {
        const groupJid = groupUpdate.jid
        const action = groupUpdate.action
        const participants = groupUpdate.participants

        const botwa = new BotWa(sock)

        const participantJid = participants[0]


        const behaviorer = new BehaviorHandler(botwa)
        behaviorer.run(action, groupJid, participantJid)

    })

    sock.on('chat-update', async (chatUpdate) => {
        if (!chatUpdate.hasNewMessage) return
        const receivedMessage = chatUpdate.messages?.all()[0]!
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
        }

    })

}




main()