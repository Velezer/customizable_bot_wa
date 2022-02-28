import { GroupSettingChange, proto, WAChatUpdate, WAGroupParticipant, WAParticipantAction } from '@adiwajshing/baileys';
import { plainToClass } from 'class-transformer';
import { Behavior } from '../Behavior/Behavior';
import { DemoteParticipantBehavior, LeaveGroupParticipantBehavior, PromoteParticipantBehavior, WelcomeGroupParticipantAddBehavior } from '../Behavior/behaviors';
import { BotWa } from '../BotWa/BotWa';
import { Command, CommandLevel } from '../Command/Command';
import { ActivateCommand } from '../Command/commands';
import { allCommands } from '../Command/regular.command';
import { RegisterGroupCommand, TrialCommand, UnregCommand } from '../Command/special.command';
import { GroupChat } from '../groups/GroupChat';
import { GroupManager } from '../groups/GroupManager';
import { LoggerOcedBot } from '../logger/Logger';
import { OcedBot } from '../ocedbot/OcedBot';
import { UpdateHandler } from './interface';

export class Commander implements UpdateHandler<Command> {
    botwa: BotWa;

    groupChats: GroupChat[] = GroupManager.getRegisteredGroup()
    handlers: Command[] = allCommands

    constructor(botwa: BotWa) {
        this.botwa = botwa
    }

    async isSentByGroupAdmin(receivedMessage: proto.WebMessageInfo, participants: WAGroupParticipant[]) {
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

    async runUnreg(conversation: string) {
        if (conversation.startsWith('/unreg')) {
            const c = new UnregCommand()
            c.run(this.botwa, new GroupChat('unused'), conversation).catch(err => console.error(err))
        }
    }

    async runCommands(jid: string, conversation: string, level: CommandLevel) {
        let group = this.groupChats.find(g => g.jid === jid)

        if (level !== CommandLevel.MEMBER) {
            if (conversation.startsWith('/trial')) {
                if (group) {
                    this.botwa.sendMessage(jid, 'trial habis')
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
                        this.botwa.sendMessage(jid, 'bot masih dalam masa sewa/trial')
                        return
                    }
                }

                const c = new RegisterGroupCommand()
                const groupChat: GroupChat = new GroupChat(jid)
                c.run(this.botwa, groupChat, conversation).catch(err => console.error(err))
                return
            }
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

        const command = this.handlers.find(c => (m0 === c.key && c.level === level)) || this.handlers.find(c => (m0 === c.key && c.level === CommandLevel.MEMBER))
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




}


