import { Activation } from "../activation/activation";
import { BotLevel } from "../groups/interface";
import { LoggerOcedBot } from "../logger";
import { OcedBot } from "../ocedbot";
import { Command, CommandLevel, RunArgs } from "./interface";


export class RegisterGroupCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/sewa';
    example: string = '/sewa key-aktivasi';
    description: string = 'sewa bot 30 hari';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(args: RunArgs): Promise<void> {
        const { conversation, groupChat, botwa, services } = args
        const m1 = conversation.slice(this.key.length + 1)
        const jid = groupChat!.jid
        const groupSubject = await botwa.getGroupSubject(groupChat!.jid)

        if (!m1) {
            botwa.sendText(jid, 'silakan hubungi \nwa.me/' + OcedBot.getPhoneNumber() + ' untuk mendapatkan key-aktivasi')
            return
        }

        const activation = new Activation()
        const activationKeys = activation.getActivationKey()
        const activationKey = activationKeys.find(k => k.key === m1)

        if (activationKey) {
            botwa.sendText(jid, 'sedang mengaktivasi...')

            services!.serviceGroupChat.sewa(groupChat!.jid, activationKey.botLevel)
                .then(() => {
                    botwa.sendText(jid, 'aktivasi sukses bot ' + activationKey.botLevel)
                    LoggerOcedBot.log(botwa, 'aktivasi sukses dengan key \n\n' + JSON.stringify(activationKey) + '\n\n' + groupSubject + '\n\n' + jid)
                })
                .catch(err => {
                    botwa.sendText(jid, 'aktivasi gagal, mohon hubungi \nwa.me/' + OcedBot.getPhoneNumber())
                    LoggerOcedBot.log(botwa, 'aktivasi gagal dengan key ' + activationKey + '\n\n' + groupSubject)
                })

        } else {
            botwa.sendText(jid, 'aktivasi gagal, mohon periksa key-aktivasi anda')
            LoggerOcedBot.log(botwa, 'upaya aktivasi gagal, diperkirakan ada kesalahan key' + '\n\n' + groupSubject)
        }

    }
}

export class TrialCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/trial';
    example: string = '/trial';
    description: string = 'trial 1 hari';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(args: RunArgs): Promise<void> {
        const { botwa, groupChat, services } = args
        const jid = groupChat!.jid

        const groupSubject = await botwa.getGroupSubject(groupChat!.jid)

        botwa.sendText(jid, 'sedang mengaktivasi trial...')

        services!.serviceGroupChat.trial(jid)
            .then(() => {
                botwa.sendText(jid, 'aktivasi trial sukses')
                LoggerOcedBot.log(botwa, 'aktivasi trial sukses' + '\n\n' + groupSubject + '\n\n' + jid)
            })
            .catch(err => {
                console.error(err)
                botwa.sendText(jid, 'aktivasi trial gagal, mohon hubungi \nwa.me/' + OcedBot.getPhoneNumber())
                LoggerOcedBot.log(botwa, 'aktivasi trial gagal ' + '\n\n' + groupSubject)

            })

    }
}

export class UnregCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/unreg';
    example: string = '/unreg jid';
    description: string = 'unreg group';
    level: CommandLevel = CommandLevel.OCEDBOT;

    async run(args: RunArgs): Promise<void> {
        const { conversation, services, botwa } = args
        const m1 = conversation.slice(this.key.length + 1)
        const targetJid = m1

        const res = await services!.serviceGroupChat.remove(targetJid)
        if (res) {
            LoggerOcedBot.log(botwa, 'unreg ' + targetJid)
        } else {
            LoggerOcedBot.log(botwa, 'unreg gagal')
        }

    }
}

export class BlacklistCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/blacklist';
    example: string = '/blacklist jid';
    description: string = 'blacklist group';
    level: CommandLevel = CommandLevel.OCEDBOT;

    async run(args: RunArgs): Promise<void> {
        const { conversation, services, botwa } = args
        const m1 = conversation.slice(this.key.length + 1)
        const targetJid = m1

        const res = await services!.serviceGroupChat.blacklist(targetJid)
        LoggerOcedBot.log(botwa, 'blacklist s' + targetJid)
    }
}

export class MonitorCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/monitor';
    example: string = '/monitor';
    description: string = 'monitor resources';
    level: CommandLevel = CommandLevel.OCEDBOT;

    async run(args: RunArgs): Promise<void> {
        const { botwa } = args

        const mem = process.memoryUsage()
        let text = ''
        text += '_Memory_\n'
        text += `rss: ${mem.rss/1024/1024}\n`
        text += `heapTotal: ${mem.heapTotal/1024/1024} MB\n`
        text += `heapUsed: ${mem.heapUsed/1024/1024} MB\n`
        text += `external: ${mem.external/1024/1024} MB\n`
        text += `arrayBuffers: ${mem.arrayBuffers/1024/1024} MB`

        LoggerOcedBot.log(botwa, text)
    }
}
