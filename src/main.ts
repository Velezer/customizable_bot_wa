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

        const jid = receivedMessage.key.remoteJid!
        const participants = await botwa.getGroupParticipants(jid)

        const conversation = receivedMessage.message?.conversation || receivedMessage.message?.extendedTextMessage?.text
        if (!conversation) return

        const commander = new Commander(botwa, chatUpdate)
        if (! await commander.isSentByGroupAdmin(receivedMessage, jid, participants)) return
        
        const isBotAdmin = await commander.isBotAdmin(participants)
        if (!isBotAdmin) {
            botwa.sendMessage(jid, 'jadiin admin dulu dong')
            return
        }

        commander.runCommands(jid, conversation)
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