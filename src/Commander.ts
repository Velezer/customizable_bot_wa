import { GroupSettingChange, proto, WAChatUpdate, WAGroupParticipant } from '@adiwajshing/baileys';
import { plainToClass } from 'class-transformer';
import { Behavior } from './Behavior/Behavior';
import { LeaveGroupParticipantBehavior, WelcomeGroupParticipantAddBehavior, WelcomeGroupParticipantInviteBehavior } from './Behavior/behaviors';
import { BotWa } from './BotWa/BotWa';
import { Command } from './Command/Command';
import { ActivateCommand } from './Command/commands';
import { allCommands } from './Command/regular.command';
import { RegisterGroupCommand, TrialCommand } from './Command/special.command';
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

    async isSentByGroupAdmin(receivedMessage: proto.WebMessageInfo, jidGroup: string, participants: WAGroupParticipant[]) {
        const sender = receivedMessage.participant

        for (const p of participants) {
            if (p.jid === sender && p.isAdmin) return true
        }
        return false
    }

    async silakanSewa(jid: string) {
        this.botwa.sendMessage(jid, 'silakan hubungi dahulu \nwa.me/' + OcedBot.getPhoneNumber() + '\nuntuk sewa bot' +
            '\n\njika sudah silakan gunakan command \n/sewa')
    }

    async isBotAdmin(participants: WAGroupParticipant[]) {
        const userInfo = this.botwa.getUserInfo()

        for (const p of participants) {
            if (p.jid === (await userInfo).jid && p.isAdmin) return true
        }
        return false
    }



    async runCommands(receivedMessage: proto.WebMessageInfo) {
        const jid = receivedMessage.key.remoteJid!
        const participants = await this.botwa.getGroupParticipants(jid)


        if (! await this.isSentByGroupAdmin(receivedMessage, jid, participants)) return
        const conversation = receivedMessage.message?.conversation || receivedMessage.message?.extendedTextMessage?.text
        if (!conversation) return


        let group = this.groupChats.find(g => g.jid === jid)

        if (conversation.startsWith('/trial')) {
            if (group) {
                this.botwa.sendMessage(jid, 'ente udah udah pernah trial')
                return
            }

            const c = new TrialCommand()
            const groupChat: GroupChat = new GroupChat(jid)
            c.run(this.botwa, groupChat, conversation).catch(err => console.error(err))
            return
        }

        if (conversation.startsWith('/sewa')) {
            if (group) {
                group = plainToClass(GroupChat, group)
                if (!group.isExpired()) {
                    this.botwa.sendMessage(jid, 'ente udah sewa')
                    return
                }
            }

            const c = new RegisterGroupCommand()
            const groupChat: GroupChat = new GroupChat(jid)
            c.run(this.botwa, groupChat, conversation).catch(err => console.error(err))
            return
        }

        if (!group && conversation.startsWith('/')) {
            this.silakanSewa(jid)
            return
        }

        group = plainToClass(GroupChat, group)
        if (group?.isExpired()) {
            this.botwa.sendMessage(jid, 'bot sudah expired')
            this.silakanSewa(jid)
            return
        }


        const isBotAdmin = await this.isBotAdmin(participants)
        if (!isBotAdmin) {
            this.botwa.sendMessage(jid, 'jadiin admin dulu dong')
            return
        }

        if (conversation.startsWith('/activate')) {
            const command = new ActivateCommand()
            command.run(this.botwa, group, conversation)
            return
        }

        const m0 = conversation.split(' ')[0]
        const customCommand = group?.groupCommands.find(c => m0 === c.key)
        if (customCommand) {
            this.botwa.sendMessage(jid, customCommand.value)
            return
        }

        const command = this.commands.find(c => m0 === c.key)
        if (!command) return

        const hasCommand = group!.commandKeys.includes(command.key)
        if (!hasCommand) {
            this.botwa.sendMessage(jid, 'silakan aktifkan command\n' + command.key)
            return
        }

        command.run(this.botwa, group!, conversation).catch(err => {
            console.error(err)
            LoggerOcedBot.log(this.botwa, err)
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


