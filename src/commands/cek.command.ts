import { plainToClass } from "class-transformer";
import { BotWa } from "../botwa";
import { GroupChat } from "../groups/group.chat";
import { BotLevel } from "../groups/interface";
import { Command, CommandLevel } from "./interface";


export class CekCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/cek';
    example: string = this.key;
    description: string = 'cek masa aktif';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        groupChat = plainToClass(GroupChat, groupChat)
        if (groupChat.trial === true) {
            await botwa.sendMessage(groupChat.jid, groupChat.botLevel + '\n\ntrial pada\n' + groupChat.registeredAt() + '\n\ntrial expired pada\n' + groupChat.trialExpiredAt());
        } else {
            await botwa.sendMessage(groupChat.jid, groupChat.botLevel + '\n\nsewa pada\n' + groupChat.registeredAt() + '\n\nexpired pada\n' + groupChat.expiredAt());
        }

    }
}