import { GroupParticipant, proto } from "@adiwajshing/baileys";
import { BotWa } from "../botwa";
import { Command, CommandLevel } from "../commands/interface";
import { allCommands } from "../commands";
import { MonitorMemoryCommand, UnregCommand, TrialCommand, RegisterGroupCommand, BlacklistCommand, MonitorGroupCommand } from "../commands/special.command";
import { BotLevel } from "../groups/interface";
import { OcedBot } from "../ocedbot";
import { Handler } from "./interface";
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

    async isSentByGroupAdmin(receivedMessage: proto.IWebMessageInfo, participants: GroupParticipant[]) {
        const sender = receivedMessage.participant || receivedMessage.key.participant

        for (const p of participants) {
            if (p.id === sender && (p.admin?.includes('admin') || p.isAdmin || p.isSuperAdmin)) return true
        }
        return false
    }

    async silakanSewa(jid: string) {
        this.botwa.sendText(jid, 'silakan hubungi dahulu \nwa.me/' + OcedBot.getPhoneNumber() + '\nuntuk sewa bot' +
            '\n\njika sudah silakan gunakan command \n/sewa')
    }

    async isBotAdmin(participants: GroupParticipant[]) {
        const userInfo = await this.botwa.getUserInfo()

        for (const p of participants) {
            if (p.id === userInfo.id && p.isAdmin) return true
        }
        return false
    }

    async runLogger(conversation: string) {
        const loggerCommands = [
            new MonitorMemoryCommand(),
            new MonitorGroupCommand(),
            new UnregCommand(),
            new BlacklistCommand()
        ]
        const command = loggerCommands.filter(c => c.key.startsWith(conversation))[0]
        if (command) command.run({
            botwa: this.botwa,
            conversation: conversation,
            services: this.services
        })
    }

    async run(jid: string, conversation: string, level: CommandLevel, quotedMessage: proto.IMessage, receivedMessage: proto.IWebMessageInfo) {
        let group = await this.services.serviceGroupChat.findOneByJid(jid)
        if (!group) {
            group = await this.services.serviceGroupChat.create(jid)
        } else if (group.blacklist) {
            return this.botwa.sendText(group.jid, 'group ini diblacklist')
        }

        console.log(group)

        const neverTrial = !group.trialExpiredAt
        const neverSewa = !group.sewaExpiredAt
        const pernahTrial = !neverTrial
        const pernahSewa = !neverSewa
        const trialExpired = group.trialExpiredAt < new Date()
        const sewaExpired = group.sewaExpiredAt < new Date()

        if (level !== CommandLevel.MEMBER) {
            if (conversation.startsWith('/trial') && neverTrial) {
                return new TrialCommand().run({ botwa: this.botwa, groupChat: group, conversation, services: this.services })
            }
            if (conversation.startsWith('/sewa') && (sewaExpired || neverSewa)) {
                return new RegisterGroupCommand().run({ botwa: this.botwa, groupChat: group, conversation, services: this.services })
            }
        }

        if (neverSewa && neverTrial) {
            if (conversation.startsWith('/')) return this.silakanSewa(jid)
        }

        if ((sewaExpired && pernahSewa) || (trialExpired && neverSewa && pernahTrial)) {
            this.botwa.sendText(jid, 'trial/sewa sudah expired')
            return this.silakanSewa(jid)
        }


        const m0 = conversation.split(' ')[0]
        const groupMenu = await this.services.serviceGroupMenu.findOneMenu(jid, m0)
        if (groupMenu) {
            if (groupMenu.type === GroupMenuType.TEXT) return this.botwa.sendText(jid, groupMenu.value)
            if (groupMenu.type === GroupMenuType.IMAGE) return this.botwa.sendImage(jid, Buffer.from(groupMenu.imageStorage.image))
        }

        const commands = this.handlers
            .filter(c => (m0 === c.key))
            .filter(c => c.level === level || c.level === CommandLevel.MEMBER)
            .filter(c => c.botLevel === group?.botLevel || c.botLevel === BotLevel.BASIC)
        if (commands.length < 1) return

        const command = commands[0]
        command.run({ botwa: this.botwa, groupChat: group, conversation, quotedMessage, receivedMessage, services: this.services })
    }
}


