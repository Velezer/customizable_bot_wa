import { BotLevel } from "../groups/interface";
import { Command, CommandLevel, RunArgs } from "./interface";


export class CekCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/cek';
    example: string = this.key;
    description: string = 'cek masa aktif';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat } = args

        const localDate = (date: Date) => date.toLocaleString('id-ID', { month: 'long', year: 'numeric', day: 'numeric' }) +
            ' jam ' + date.toLocaleString('id-ID', { hour: 'numeric', minute: 'numeric' })

        if (new Date() < groupChat!.sewaExpiredAt){
            await botwa.sendMessage(groupChat!.jid, groupChat!.botLevel + '\n\nsewa expired pada\n' + localDate(new Date(groupChat!.sewaExpiredAt)))
        }
        if (new Date() < groupChat!.trialExpiredAt){
            await botwa.sendMessage(groupChat!.jid, groupChat!.botLevel + '\n\ntrial expired pada\n' + localDate(new Date(groupChat!.trialExpiredAt)))
        }

    }
}