import { GroupSettingChange, proto, WAChatUpdate } from '@adiwajshing/baileys';
import { Behavior } from './Behavior/Behavior';
import { LeaveGroupParticipantBehavior, WelcomeGroupParticipantAddBehavior, WelcomeGroupParticipantInviteBehavior } from './Behavior/behaviors';
import { BotWa } from './BotWa/BotWa';
import { allCommands, Command } from './Command/Command';
import { ActivateCommand, CekCommand, CloseGroupChatCommand, CloseGroupSettingsCommand, DemoteCommand, GetGroupMetadataCommand, GetGroupParticipantsCommand, MenuCommand, OpenGroupChatCommand, OpenGroupSettingsCommand, PromoteCommand, TagAllCommand } from './Command/commands';
import { GroupChat } from './groups/Group';
import { GroupManager } from './groups/GroupManager';
import fs from 'fs'
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
        this.botwa.sendMessage(jid, 'silakan hubungi wa.me/' + OcedBot.getPhoneNumber() + ' untuk sewa bot' +
        '\natau jika sudah silakan gunakan command /sewa')
    }

    async runCommands() {
        if (!this.chatUpdate.hasNewMessage) return
        const receivedMessage = this.chatUpdate.messages?.all()[0]!


        if (receivedMessage.key.fromMe === true) return
        if (!receivedMessage?.message) return

        const jid = receivedMessage.key.remoteJid!

        if (! await this.isSentByGroupAdmin(receivedMessage, jid)) return
        const conversation = receivedMessage.message?.conversation!

        if (this.groupChats.length < 1) {
            if (conversation.startsWith('/')) {
                this.silakanSewa(jid)
                return
            }
        }

        this.groupChats.forEach(group => {

            this.commands.forEach(async command => {

                if (!conversation.startsWith(command.key)) return
                console.log(receivedMessage)

                const isGroupRegistered = group.jid === jid
                if (!isGroupRegistered) {
                    this.silakanSewa(jid)
                    return
                }

                const hasCommand = group.commandKeys.includes(command.key)
                if (!hasCommand) {
                    this.botwa.sendMessage(jid, 'silakan upgrade bot biar bisa pake command ' + command.key + '\nkamu bisa hubungi wa.me/' + fs.readFileSync('oced.txt'))
                    return
                }

                command.run(this.botwa, jid, conversation).catch(err => console.error(err))
            });
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


