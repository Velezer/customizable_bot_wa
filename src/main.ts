import { BotWa } from './botwa'
import { ReconnectMode, WAConnection } from '@adiwajshing/baileys'
import { Activation } from './activation/activation'
import { Helper } from './helper/file'
import { BehaviorHandler } from './handlers/behavior.handler'
import { CommandHandler } from './handlers/command.handler'
import { LoggerOcedBot } from './logger'
import { CommandLevel } from './commands/interface'



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
            receivedMessage.message?.buttonsResponseMessage?.selectedDisplayText

        if (!conversation) return

        const commander = new CommandHandler(botwa)
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