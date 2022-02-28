import { BotWa } from './BotWa/BotWa'
import { Commander } from './update-handler/Commander'
import { ReconnectMode, WAConnection } from '@adiwajshing/baileys'
import * as auth from './auth/auth'
import { OcedBot } from './ocedbot/OcedBot'
import { LoggerOcedBot } from './logger/Logger'
import { CommandLevel } from './Command/Command'
import { Behaviorer } from './update-handler/Behaviorer'
import { Activation } from './activation/activation'



async function main() {
    const sock: WAConnection = new WAConnection()
    sock.logger.level = 'debug' //''debug', 'fatal', 'error',  'trace'
    sock.version = [2, 2143, 3]
    sock.browserDescription = ['velezer', 'Chrome', 'OcedBot']
    sock.autoReconnect = ReconnectMode.onAllErrors

    if (auth.isExist('auth.json')) {
        sock.loadAuthInfo('auth.json')
    }

    await sock.connect()
    auth.saveAuth('auth.json', sock.base64EncodedAuthInfo())

    sock.on('connection-phone-change', async (data) => {
        console.log('connection change-==-=-=-=-=-=-=-')
        console.log(data)
        console.log('connection change-==-=-=-=-=-=-=-')
    })

    sock.on('close', async (data) => {
        console.log('close close close-==-=-=-=-=-=-=-')
        console.log(data)
        console.log('close close close-==-=-=-=-=-=-=-')

    })
    sock.on('group-participants-update', async (groupUpdate) => {
        const jid = groupUpdate.jid
        const action = groupUpdate.action
        const participants = groupUpdate.participants

        const botwa = new BotWa(sock)

        const participantJid = participants[0]
        console.log('--------------')
        console.log(sock.contacts[participantJid])
        console.log('--------------')

        const behaviorer = new Behaviorer(botwa)
        behaviorer.run(action, jid, participantJid)

    })

    sock.on('chat-update', async (chatUpdate) => {
        if (!chatUpdate.hasNewMessage) return
        const receivedMessage = chatUpdate.messages?.all()[0]!
        if (receivedMessage.key.fromMe === true) return
        if (!receivedMessage?.message) return

        // console.log(receivedMessage)

        const botwa = new BotWa(sock)

        if (receivedMessage.message?.conversation?.startsWith('/key')) {
            let msg = ''
            Activation.getActivationKey().forEach(k => {
                msg += k.botLevel + '\n\nsewa/ ' + k.key + '\n\n'
            })
            LoggerOcedBot.log(botwa, msg)
            return
        }

        const jid = receivedMessage.key.remoteJid!
        const isNotGroup = jid.split('@')[1] !== 'g.us'
        if (isNotGroup) return

        const participants = await botwa.getGroupParticipants(jid)

        const conversation = receivedMessage.message?.conversation ||
            receivedMessage.message?.extendedTextMessage?.text ||
            receivedMessage.message?.listResponseMessage?.title ||
            receivedMessage.message?.buttonsResponseMessage?.selectedDisplayText

        if (!conversation) return

        const commander = new Commander(botwa)
        if (! await commander.isSentByGroupAdmin(receivedMessage, participants)) {
            await commander.run(jid, conversation, CommandLevel.MEMBER).catch(err => console.error(err))
            return
        }

        const isBotAdmin = await commander.isBotAdmin(participants)
        if (!isBotAdmin) {
            botwa.sendMessage(jid, 'jadiin admin dulu dong')
            return
        }

        commander.run(jid, conversation, CommandLevel.ADMIN).catch(err => console.error(err))

        if (jid === LoggerOcedBot.jid) {
            commander.unreg(conversation)
        }
    })

}

function run() {
    try {
        main().catch(err => run())
    } catch (err) {
        console.log('------------------')
        console.log('LAPORAN CID! ERROR IKI')
        console.log('------------------')
        console.error(err)
        run()
    }
}


run()