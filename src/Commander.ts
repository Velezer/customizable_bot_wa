import { proto, WAChatUpdate } from '@adiwajshing/baileys';
import { Behavior } from './Behavior/Behavior';
import { LeaveGroupParticipantBehavior, WelcomeGroupParticipantAddBehavior, WelcomeGroupParticipantInviteBehavior } from './Behavior/behaviors';
import { BotWa } from './BotWa/BotWa';
import { Command } from './Command/Command';
import { ActivateCommand, CekCommand, CloseGroupChatCommand, CloseGroupSettingsCommand, GetGroupMetadataCommand, GetGroupParticipantsCommand, MenuCommand, OpenGroupChatCommand, OpenGroupSettingsCommand, TagAllCommand } from './Command/commands';

export class Commander {
    chatUpdate: WAChatUpdate;
    botwa: BotWa;

    commands: Command[];
    behaviors: Behavior[];


    constructor(botwa: BotWa, chatUpdate: WAChatUpdate) {
        this.botwa = botwa
        this.chatUpdate = chatUpdate

        this.commands = [
            new ActivateCommand(), // must be top on list
            new CekCommand(),
            new TagAllCommand(),
            new GetGroupMetadataCommand(),
            new GetGroupParticipantsCommand(),
            new OpenGroupSettingsCommand(),
            new CloseGroupSettingsCommand(),
            new OpenGroupChatCommand(),
            new CloseGroupChatCommand()
            // new JoinGrupCommand()
        ]
        this.commands.push(new MenuCommand(this.commands))



        this.behaviors = [
            new WelcomeGroupParticipantAddBehavior(),
            new WelcomeGroupParticipantInviteBehavior(),
            new LeaveGroupParticipantBehavior()
        ]

    }




    async runCommands() {
        if (!this.chatUpdate.hasNewMessage) return
        const receivedMessage = this.chatUpdate.messages?.all()[0]!

        if (receivedMessage.key.fromMe === true) return

        if (!receivedMessage?.message) return
        const jid = receivedMessage.key.remoteJid!


        this.commands.forEach(async command => {
            if (command.groupAdminOnly === true) { // admin only command
                const senderRoleAdmin = await this.botwa.isSentByAdmin(jid, receivedMessage)
                if (senderRoleAdmin === false) {// check if sender is not admin
                    this.botwa.sendMessage(jid, 'ente bukan admin grup')
                }
            }

            command.cb(this.botwa, jid, receivedMessage.message?.conversation!)

            if (!this.botwa.checkActivation(jid)) {
                this.botwa.sendMessage(jid, 'aktifkan bot sebelum digunakan')
                return
            }
        });

    }

    runBehaviors() {
        const receivedMessage = this.chatUpdate.messages?.all()[0]!
        const receivedStubType = receivedMessage.messageStubType!
        const jid = receivedMessage.key.remoteJid!

        this.behaviors.forEach(async behavior => {
            behavior.cb(this.botwa, jid, receivedStubType)
        })
    }
}


