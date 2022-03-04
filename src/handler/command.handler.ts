import { GroupSettingChange, proto, WAChatUpdate, WAGroupParticipant, WAParticipantAction } from '@adiwajshing/baileys';
import { plainToClass } from 'class-transformer';
import { BotWa } from '../BotWa/BotWa';
import { Command, CommandLevel } from '../Command/interface';
import { allCommands } from '../Command/regular.command';
import { RegisterGroupCommand, TrialCommand, UnregCommand } from '../Command/special.command';
import { GroupChat } from '../groups/group.chat';
import { GroupManager } from '../groups/group.manager';
import { LoggerOcedBot } from '../logger/logger';
import { OcedBot } from '../ocedbot/ocedbot';
import { Handler } from './interface';
import { BotLevel } from '../groups/interface';

export class CommandHandler implements Handler<Command> {
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
        const userInfo = await this.botwa.getUserInfo()

        for (const p of participants) {
            if (p.jid === userInfo.jid && p.isAdmin) return true
        }
        return false
    }

    async unreg(conversation: string) {
        if (conversation.startsWith('/unreg')) {
            const c = new UnregCommand()
            c.run(this.botwa, new GroupChat('unused'), conversation).catch(err => console.error(err))
        }
    }

    async run(jid: string, conversation: string, level: CommandLevel, quotedMessage: proto.IMessage) {
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
                    if (!group.isExpired() && !group.trial) {
                        this.botwa.sendMessage(jid, 'bot masih dalam masa sewa')
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
        if (group?.trial) {
            if (group.isTrialExpired()) {
                this.botwa.sendMessage(jid, 'trial sudah expired')
                this.silakanSewa(jid)
                return
            }
        }
        if (group?.isExpired()) {
            this.botwa.sendMessage(jid, 'sewa sudah expired')
            this.silakanSewa(jid)
            return
        }


        const m0 = conversation.split(' ')[0]
        const groupMenu = group?.groupMenu.find(m => m0 === m.key)
        if (groupMenu) {
            this.botwa.sendMessage(jid, groupMenu.value)
            return
        }


        const commands = this.handlers.filter(c => (m0 === c.key))
            .filter(c => c.level === level || c.level === CommandLevel.MEMBER)
            .filter(c => c.botLevel === group?.botLevel || c.botLevel === BotLevel.BASIC)
        if (!(commands.length > 0)) return

        const command = commands[0]


        command.run(this.botwa, group!, conversation, quotedMessage).catch(err => {
            console.error(err)
            LoggerOcedBot.log(this.botwa, err)
        })

    }




}


