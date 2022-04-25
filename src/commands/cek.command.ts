import { BotLevel } from "../groups/interface";
import { Command, CommandLevel, RunArgs } from "./interface";


export class CekCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/cek';
    example: string = this.key;
    description: string = 'cek masa aktif';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(args: RunArgs): Promise<void> {
        const { botwa, groupChat } = args
        console.log('-----------------')
        console.log('/cek revoked')
        
        const localDate = (date: Date) => date.toLocaleString('id-ID', { month: 'long', year: 'numeric', day: 'numeric', timeZone: 'Asia/Jakarta' }) +
        ' jam ' + date.toLocaleString('id-ID', { hour: 'numeric', minute: 'numeric', timeZone: 'Asia/Jakarta' })
        
        console.log(localDate(groupChat!.sewaExpiredAt))
        console.log(localDate(groupChat!.trialExpiredAt))
        if (new Date() < groupChat!.sewaExpiredAt) {
            await botwa.sendText(groupChat!.jid, groupChat!.botLevel + '\n\nsewa expired pada\n' + localDate(groupChat!.sewaExpiredAt))
        }
        if (new Date() < groupChat!.trialExpiredAt) {
            await botwa.sendText(groupChat!.jid, groupChat!.botLevel + '\n\ntrial expired pada\n' + localDate(groupChat!.trialExpiredAt))
        }
        
        console.log('-----------------')
    }
}