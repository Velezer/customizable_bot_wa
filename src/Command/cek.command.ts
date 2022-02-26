import { plainToClass } from "class-transformer";
import { BotWa } from "../BotWa/BotWa";
import { GroupChat } from "../groups/GroupChat";
import { Command, CommandLevel } from "./Command";



export class CekCommand implements Command {
    key: string = '/cek';
    example: string = this.key;
    description: string = 'cek masa aktif';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        groupChat = plainToClass(GroupChat, groupChat)
        if (groupChat.trial === true) {
            await botwa.sendMessage(groupChat.jid, 'trial pada\n' + groupChat.registeredAt() + '\n\ntrial expired pada\n' + groupChat.trialExpiredAt());
        } else {
            await botwa.sendMessage(groupChat.jid, 'sewa pada\n' + groupChat.registeredAt() + '\n\nexpired pada\n' + groupChat.expiredAt());
        }

    }
}