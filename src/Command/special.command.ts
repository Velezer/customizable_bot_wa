import { BotWa } from "../BotWa/BotWa";
import { GroupChat } from "../groups/GroupChat";
import { GroupManager } from "../groups/GroupManager";
import { LoggerOcedBot } from "../logger/Logger";
import { OcedBot } from "../ocedbot/OcedBot";
import { Command, CommandLevel } from "./Command";



export class RegisterGroupCommand implements Command {
    key: string = '/sewa';
    example: string = '/sewa key-aktivasi';
    description: string = 'sewa bot 30 hari';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const m1 = conversation.slice(this.key.length + 1)
        const jid = groupChat.jid
        const groupSubject = await botwa.getGroupSubject(groupChat.jid)

        if (!m1) {
            botwa.sendMessage(jid, 'silakan hubungi \nwa.me/' + OcedBot.getPhoneNumber() + ' untuk mendapatkan key-aktivasi')
            return
        }

        const activationKey = OcedBot.getActivationKey()
        if (m1 === activationKey) {
            botwa.sendMessage(jid, 'sedang mengaktivasi...')
            let isRegistered = false
            try {
                isRegistered = GroupManager.register(groupChat)
            } catch (err) {
                console.error(err)
                botwa.sendMessage(jid, 'aktivasi gagal, mohon hubungi \nwa.me/' + OcedBot.getPhoneNumber())
                LoggerOcedBot.log(botwa, 'aktivasi gagal dengan key ' + activationKey + '\n\n' + groupSubject)
                return
            }

            if (isRegistered) {
                botwa.sendMessage(jid, 'aktivasi sukses')

                LoggerOcedBot.log(botwa, 'aktivasi sukses dengan key ' + activationKey + '\n\n' + groupSubject + '\n\n' + jid)
                OcedBot.generateActivationKey()
            }
        } else {
            botwa.sendMessage(jid, 'aktivasi gagal, mohon periksa key-aktivasi anda')
            LoggerOcedBot.log(botwa, 'upaya aktivasi gagal, diperkirakan ada kesalahan key' + '\n\n' + groupSubject)
        }

    }
}

export class TrialCommand implements Command {
    key: string = '/trial';
    example: string = '/trial';
    description: string = 'trial 1 hari';
    level: CommandLevel = CommandLevel.ADMIN;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const jid = groupChat.jid


        const groupSubject = await botwa.getGroupSubject(groupChat.jid)

        botwa.sendMessage(jid, 'sedang mengaktivasi trial...')
        let isRegistered = false
        try {
            isRegistered = GroupManager.register(groupChat, true);
        } catch (err) {
            console.error(err)
            botwa.sendMessage(jid, 'aktivasi trial gagal, mohon hubungi \nwa.me/' + OcedBot.getPhoneNumber())
            LoggerOcedBot.log(botwa, 'aktivasi trial gagal ' + '\n\n' + groupSubject)
            return
        }

        if (isRegistered) {
            botwa.sendMessage(jid, 'aktivasi trial sukses')

            LoggerOcedBot.log(botwa, 'aktivasi trial sukses' + '\n\n' + groupSubject + '\n\n' + jid)
            OcedBot.generateActivationKey()
        }

    }
}

export class UnregCommand implements Command {
    key: string = '/unreg';
    example: string = '/unreg jid';
    description: string = 'unreg group';
    level: CommandLevel = CommandLevel.OCEDBOT;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const m1 = conversation.slice(this.key.length + 1)
        const targetJid = m1

        GroupManager.remove(targetJid)
        LoggerOcedBot.log(botwa, 'unreg ' + targetJid)

    }
}

