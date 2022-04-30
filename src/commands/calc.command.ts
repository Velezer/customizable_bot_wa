import { BotLevel } from "../groups/interface";
import { Command, CommandLevel, RunArgs } from "./interface";


export class CalcCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/calc';
    example: string = '/calc 1+1*2+4/1-3**1';
    description: string = 'kalkulator kabataku';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(args: RunArgs) {
        const { botwa, groupChat, conversation } = args
        const m1 = conversation.slice(this.key.length + 1)


        const dangerous = ['process', 'global', 'globalThis', 'this', 'x', 'X']
        for (const d of dangerous) {
            if (m1.includes(d)) return
        }

        try {
            botwa.sendText(groupChat?.jid!, Number(Function(`return ${m1}`)()).toString())
        } catch (err) {
            botwa.sendText(groupChat?.jid!, 'pala gw pusing ngitung terus')
        }
    }
}
