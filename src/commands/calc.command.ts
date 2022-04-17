import { BotLevel } from "../groups/interface";
import { Command, CommandLevel, RunArgs } from "./interface";


export class CalcCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/calc';
    example: string = '/calc 1+1';
    description: string = 'kalkulator kabataku';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(args: RunArgs) {
        const { botwa, groupChat, services, quotedMessage, conversation } = args
        const m1 = conversation.slice(this.key.length + 1)

        botwa.sendText(groupChat?.jid!, Number(Function('return '+ m1)).toString())
    }
}
