import { BotLevel } from "../groups/interface";
import { Command, CommandLevel, RunArgs } from "./interface";
import translate from '@vitalets/google-translate-api';

export class TranslateCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/translate';
    example: string = this.key + ' words';
    description: string = 'translate bahasa apapun ke Indonesia';
    level: CommandLevel = CommandLevel.MEMBER;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat } = args
        const m1 = conversation.slice(this.key.length + 1)
        const jid = groupChat?.jid!

        const res = await translate(m1, { to: 'id', autoCorrect: true })
        await botwa.sendText(jid, 'translated from: ' + res.from.language.iso + '\n\n' + res.text)
            .catch(err => botwa.sendText(jid, 'pala gw pusing bos'))
    }
}