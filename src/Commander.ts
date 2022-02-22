import { proto } from '@adiwajshing/baileys';
import { Behavior } from './Behavior/Behavior';
import { LeaveGroupParticipantBehavior, WelcomeGroupParticipantAddBehavior, WelcomeGroupParticipantInviteBehavior } from './Behavior/behaviors';
import { BotWa } from './BotWa/BotWa';
import { Command } from './Command/Command';
import { CekCommand, MenuCommand } from './Command/commands';

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
            // new TagAllCommand(),
            // new JoinGrupCommand()
        ]
        this.commands.push(new MenuCommand(this.commands))



        this.behaviors = [
            new WelcomeGroupParticipantAddBehavior(),
            new WelcomeGroupParticipantInviteBehavior(),
            new LeaveGroupParticipantBehavior()
        ]

    }


    runCommands() {
        if (this.message.key.fromMe) return

        const receivedMessage = this.message.message?.conversation!
        const to = this.message.key.remoteJid!

        this.commands.forEach(async command => {
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


