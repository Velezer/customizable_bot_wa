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
        
        const localDate = (date: Date) => date.toLocaleString('id-ID', { month: 'long', year: 'numeric', day: 'numeric', timeZone: 'Asia/Jakarta' }) +
        ' jam ' + date.toLocaleString('id-ID', { hour: 'numeric', minute: 'numeric', timeZone: 'Asia/Jakarta' })
        
        const sewaDate = new Date(groupChat!.sewaExpiredAt)
        if (new Date() < sewaDate) {
            await botwa.sendText(groupChat!.jid, groupChat!.botLevel + '\n\nsewa expired pada\n' + localDate(sewaDate))
        }
        const trialDate = new Date(groupChat!.trialExpiredAt)
        if (new Date() < trialDate) {
            await botwa.sendText(groupChat!.jid, groupChat!.botLevel + '\n\ntrial expired pada\n' + localDate(trialDate))
        }
        
    }
}