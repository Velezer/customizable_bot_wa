import { GroupSettingChange, proto, WAChatUpdate } from '@adiwajshing/baileys';
import { Behavior } from './Behavior/Behavior';
import { LeaveGroupParticipantBehavior, WelcomeGroupParticipantAddBehavior, WelcomeGroupParticipantInviteBehavior } from './Behavior/behaviors';
import { BotWa } from './BotWa/BotWa';
import { allCommands, Command } from './Command/Command';
import { GroupChat } from './groups/Group';
import { GroupManager } from './groups/GroupManager';
import { LoggerOcedBot } from './logger/Logger';
import { OcedBot } from './ocedbot/OcedBot';

export class Commander {
    chatUpdate: WAChatUpdate;
    botwa: BotWa;

    groupChats: GroupChat[] = GroupManager.getRegisteredGroup()
    commands: Command[] = allCommands
    behaviors: Behavior[];


    constructor(botwa: BotWa, chatUpdate: WAChatUpdate) {
        this.botwa = botwa
        this.chatUpdate = chatUpdate


        this.behaviors = [
            new WelcomeGroupParticipantAddBehavior(),
            new WelcomeGroupParticipantInviteBehavior(),
            new LeaveGroupParticipantBehavior()
        ]

    }

    async isSentByGroupAdmin(receivedMessage: proto.WebMessageInfo, jidGroup: string) {
        const sender = receivedMessage.participant

        const participants = await this.botwa.getGroupParticipants(jidGroup)
        for (const p of participants) {
            if (p.jid === sender && p.isAdmin) return true
        }
        return false
    }

    async silakanSewa(jid: string) {
        this.botwa.sendMessage(jid, 'silakan hubungi dahulu \nwa.me/' + OcedBot.getPhoneNumber() + '\nuntuk sewa bot' +
            '\n\njika sudah silakan gunakan command \n/sewa')
    }

    async isOcedBotAdmin(jidGroup: string) {
        const userInfo = this.botwa.getUserInfo()

        const participants = await this.botwa.getGroupParticipants(jidGroup)
        for (const p of participants) {
            if (p.jid === (await userInfo).jid && p.isAdmin) return true
        }
        return false
    }

    async runCommands() {
        if (!this.chatUpdate.hasNewMessage) return
        const receivedMessage = this.chatUpdate.messages?.all()[0]!

        console.log(receivedMessage)
        const jid = receivedMessage.key.remoteJid!
        
        if (receivedMessage.key.fromMe === true) return
        if (!receivedMessage?.message) return
        
        if (! await this.isSentByGroupAdmin(receivedMessage, jid)) return
        const conversation = receivedMessage.message?.conversation! || receivedMessage.message.extendedTextMessage?.text!

        if (conversation.startsWith('/sewa')) {
            for (const c of this.commands) {
                if (c.key === '/sewa') {
                    const groupChat: GroupChat = new GroupChat(jid)
                    c.run(this.botwa, groupChat, conversation).catch(err => console.error(err))
                    return
                }
            }
        }
        if (this.groupChats.length < 1) {
            if (conversation.startsWith('/')) {
                this.silakanSewa(jid)
                return
            }
        }

        const isGroupRegistered = this.groupChats.map(g => g.jid).includes(jid)
        if (!isGroupRegistered) {
            this.silakanSewa(jid)
            return
        }

        const group = this.groupChats.find(g => g.jid === jid)!


        this.commands.forEach(async command => {

            if (!conversation.startsWith(command.key)) return

            const hasCommand = group.commandKeys.includes(command.key)
            if (!hasCommand) {
                this.botwa.sendMessage(jid, 'silakan upgrade bot biar bisa pake command \n' + command.key + '\nkamu bisa hubungi \nwa.me/' + OcedBot.getPhoneNumber())
                return
            }

            const isOcedBotAdmin = await this.isOcedBotAdmin(jid)

            if (!isOcedBotAdmin) {
                this.botwa.sendMessage(jid, 'jadiin admin dulu dong')
                return
            }

            command.run(this.botwa, group, conversation).catch(err => {
                console.error(err)
                LoggerOcedBot.log(this.botwa, err)
            })
        })



    }



    runBehaviors() {
        if (!this.chatUpdate.hasNewMessage) return

        const receivedMessage = this.chatUpdate.messages?.all()[0]
        const receivedStubType = receivedMessage?.messageStubType
        const jid = receivedMessage?.key.remoteJid!

        this.behaviors.forEach(async behavior => {
            if (behavior.stubType === receivedStubType) {
                behavior.run(this.botwa, jid)
            }
        })
    }
}


