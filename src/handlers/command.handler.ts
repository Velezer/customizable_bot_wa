import { proto, WAGroupParticipant } from "@adiwajshing/baileys";
import { BotWa } from "../botwa";
import { Command, CommandLevel } from "../commands/interface";
import { allCommands } from "../commands";
import { UnregCommand, TrialCommand, RegisterGroupCommand } from "../commands/special.command";
import { BotLevel } from "../groups/interface";
import { OcedBot } from "../ocedbot";
import { Handler } from "./interface";
import fs from 'fs'
import { Services } from "../typeorm/service/interface";
import { GroupMenuType } from "../typeorm/entity/GroupMenuEntity";


export class CommandHandler implements Handler<Command> {
    services: Services
    botwa: BotWa

    handlers: Command[] = allCommands

    constructor(botwa: BotWa, services: Services) {
        this.botwa = botwa
        this.services = services
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
            new UnregCommand()
                .run({
                    botwa: this.botwa,
                    conversation: conversation,
                    services: this.services
                })
                .catch(err => console.error(err))
        }
    }

    async run(jid: string, conversation: string, level: CommandLevel, quotedMessage: proto.IMessage, receivedMessage: proto.WebMessageInfo) {
        let group = await this.services.serviceGroupChat.findOneByJid(jid)
        if (!group) {
            group = await this.services.serviceGroupChat.create(jid)
        } else if (group.blacklist) {
            this.botwa.sendText(group.jid, 'group ini diblacklist')
        }

        const trialExpired = group.trialExpiredAt < new Date()
        const sewaExpired = group.sewaExpiredAt < new Date()
        const neverTrial = !group.trialExpiredAt
        const neverSewa = !group.sewaExpiredAt

        if (level !== CommandLevel.MEMBER) {
            if (conversation.startsWith('/trial')) {
                if (neverTrial) {
                    return new TrialCommand().run({ botwa: this.botwa, groupChat: group, conversation, services: this.services })
                        .catch(err => console.error(err))
                }
            }
            if (conversation.startsWith('/sewa')) {
                if (sewaExpired || neverSewa) {
                    return new RegisterGroupCommand().run({ botwa: this.botwa, groupChat: group, conversation, services: this.services })
                        .catch(err => console.error(err))
                }
            }
        }


        if (neverSewa && neverTrial) {
            if (conversation.startsWith('/')) return this.silakanSewa(jid)
        }

        if (trialExpired && neverSewa) {
            this.botwa.sendMessage(jid, 'trial sudah expired')
            this.silakanSewa(jid)
            return
        }

        if (sewaExpired) {
            this.botwa.sendMessage(jid, 'sewa sudah expired')
            this.silakanSewa(jid)
            return
        }


        const m0 = conversation.split(' ')[0]
        const groupMenu = await this.services.serviceGroupMenu.findOneMenu(jid, m0)
        if (groupMenu) {
            if (groupMenu.type === GroupMenuType.TEXT) return this.botwa.sendMessage(jid, groupMenu.value)
            if (groupMenu.type === GroupMenuType.IMAGE) return this.botwa.sendImage(jid, fs.readFileSync(groupMenu.value))
        }

        const commands = this.handlers
            .filter(c => (m0 === c.key))
            .filter(c => c.level === level || c.level === CommandLevel.MEMBER)
            .filter(c => c.botLevel === group?.botLevel || c.botLevel === BotLevel.BASIC)
        if (commands.length < 1) return

        const command = commands[0]
        command.run({ botwa: this.botwa, groupChat: group, conversation, quotedMessage, receivedMessage, services: this.services })
            .catch(err => {
                console.error(err)
            })

    }




}


