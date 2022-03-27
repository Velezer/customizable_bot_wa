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
    level: CommandLevel = CommandLevel.ADMIN;

    async run(args: RunArgs): Promise<void> {
        const { conversation, groupChat, botwa, services } = args
        const m1 = conversation.slice(this.key.length + 1)
        const jid = groupChat!.jid
        const groupSubject = await botwa.getGroupSubject(groupChat!.jid)

        if (!m1) {
            botwa.sendMessage(jid, 'silakan hubungi \nwa.me/' + OcedBot.getPhoneNumber() + ' untuk mendapatkan key-aktivasi')
            return
        }

        const activationKeys = Activation.getActivationKey()
        const activationKey = activationKeys.find(k => k.key === m1)

        if (activationKey) {
            botwa.sendMessage(jid, 'sedang mengaktivasi...')

            services!.serviceGroupChat.sewa(groupChat!.jid, activationKey.botLevel)
                .then(() => {
                    botwa.sendMessage(jid, 'aktivasi sukses bot ' + activationKey.botLevel)
                    LoggerOcedBot.log(botwa, 'aktivasi sukses dengan key \n\n' + JSON.stringify(activationKey) + '\n\n' + groupSubject + '\n\n' + jid)
                    Activation.generateActivationKey()
                })
                .catch(err => {
                    console.error(err)
                    botwa.sendMessage(jid, 'aktivasi gagal, mohon hubungi \nwa.me/' + OcedBot.getPhoneNumber())
                    LoggerOcedBot.log(botwa, 'aktivasi gagal dengan key ' + activationKey + '\n\n' + groupSubject)

                })

        } else {
            botwa.sendMessage(jid, 'aktivasi gagal, mohon periksa key-aktivasi anda')
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

        botwa.sendMessage(jid, 'sedang mengaktivasi trial...')

        services!.serviceGroupChat.trial(jid)
            .then(() => {
                botwa.sendMessage(jid, 'aktivasi trial sukses')
                LoggerOcedBot.log(botwa, 'aktivasi trial sukses' + '\n\n' + groupSubject + '\n\n' + jid)
            })
            .catch(err => {
                console.error(err)
                botwa.sendMessage(jid, 'aktivasi trial gagal, mohon hubungi \nwa.me/' + OcedBot.getPhoneNumber())
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
        if (res.affected! > 0) {
            LoggerOcedBot.log(botwa, 'unreg ' + targetJid)
        } else {
            LoggerOcedBot.log(botwa, 'unreg gagal')
        }

    }
}

