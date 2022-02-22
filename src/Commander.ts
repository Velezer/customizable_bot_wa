import { proto } from '@adiwajshing/baileys';
import { Behavior } from './Behavior/Behavior';
import { LeaveGroupParticipantBehavior, WelcomeGroupParticipantAddBehavior, WelcomeGroupParticipantInviteBehavior } from './Behavior/behaviors';
import { BotWa } from './BotWa/BotWa';
import { Command } from './Command/Command';
import { CekCommand, GetGroupMetadataCommand, GetGroupParticipantsCommand, MenuCommand, TagAllCommand } from './Command/commands';

export class Commander {
    message: proto.IWebMessageInfo;
    botwa: BotWa;

    commands: Command[];
    behaviors: Behavior[];

    constructor(botwa: BotWa, message: proto.IWebMessageInfo) {
        this.botwa = botwa
        this.message = message

        this.commands = [
            new CekCommand(),
            new TagAllCommand(),
            new GetGroupMetadataCommand(),
            new GetGroupParticipantsCommand()
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
        if (this.message.key.fromMe) return

        const receivedMessage = this.message.message?.conversation!
        const to = this.message.key.remoteJid!

        const senderRoleAdmin = await this.botwa.isSentByAdmin(to, this.message)

        this.commands.forEach(async command => {
            if (command.groupAdminOnly === true) { // admin only command
                if (senderRoleAdmin === false) return // return if sender is not admin
            }
            command.cb(this.botwa, to, receivedMessage)
        });

    }

    runBehaviors() {
        const receivedStubType = this.message.messageStubType!
        const to = this.message.key.remoteJid!

        this.behaviors.forEach(async behavior => {
            behavior.cb(this.botwa, to, receivedStubType)
        })
    }
}


