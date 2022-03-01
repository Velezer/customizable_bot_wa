import { BotWa } from './BotWa/BotWa'
import { Commander } from './update-handler/Commander'
import { proto, ReconnectMode, WAConnection } from '@adiwajshing/baileys'
import { LoggerOcedBot } from './logger/Logger'
import { CommandLevel } from './Command/interface'
import { Behaviorer } from './update-handler/Behaviorer'
import { Activation } from './activation/activation'
import { Helper } from './helper/file'



async function main() {
    const sock: WAConnection = new WAConnection()
    sock.logger.level = 'debug' //''debug', 'fatal', 'error',  'trace'
    sock.version = [2, 2143, 3]
    sock.browserDescription = ['velezer', 'Chrome', 'OcedBot']
    sock.autoReconnect = ReconnectMode.onAllErrors

    if (Helper.isExist('auth.json')) {
        sock.loadAuthInfo('auth.json')
    }

    await sock.connect()
    Helper.saveJSON('auth.json', sock.base64EncodedAuthInfo())

    sock.on('connection-phone-change', async (data) => {
        console.log('connection change-==-=-=-=-=-=-=-')
        console.log(data)
        console.log('connection change-==-=-=-=-=-=-=-')
    })

    sock.on('close', async (data) => {
        console.log('close close close-==-=-=-=-=-=-=-')
        console.log(data)
        console.log('close close close-==-=-=-=-=-=-=-')
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


        const behaviorer = new Behaviorer(botwa)
        behaviorer.run(action, groupJid, participantJid)

    })

    sock.on('chat-update', async (chatUpdate) => {
        if (!chatUpdate.hasNewMessage) return
        const receivedMessage = chatUpdate.messages?.all()[0]!
        if (receivedMessage.key.fromMe === true) return
        if (!receivedMessage?.message) return

        console.log(receivedMessage.message.extendedTextMessage?.contextInfo?.quotedMessage)

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

        const conversation = receivedMessage.message?.conversation ||
            receivedMessage.message?.extendedTextMessage?.text ||
            receivedMessage.message?.listResponseMessage?.title ||
            receivedMessage.message?.buttonsResponseMessage?.selectedDisplayText

        if (!conversation) return

        const commander = new Commander(botwa)
        if (! await commander.isSentByGroupAdmin(receivedMessage, participants)) {
            await commander.run(jid, conversation, CommandLevel.MEMBER, receivedMessage.key).catch(err => console.error(err))
            return
        }

        const isBotAdmin = await commander.isBotAdmin(participants)
        if (!isBotAdmin) {
            botwa.sendMessage(jid, 'jadiin admin dulu dong')
            return
        }

        commander.run(jid, conversation, CommandLevel.ADMIN, receivedMessage.key).catch(err => console.error(err))

        if (jid === LoggerOcedBot.jid) {
            commander.unreg(conversation)
        }
    })

}




main()