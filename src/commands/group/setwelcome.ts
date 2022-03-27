import { BotLevel } from "../../groups/interface";
import { Command, CommandLevel, RunArgs } from "../interface";


export class SetWelcomeCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/set-welcome';
    example: string = this.key + ' welcome [member_name] di [group_name]';
    description: string = 'demote member grup';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat, services } = args
        const jid = groupChat?.jid
        let m1 = conversation.slice(this.key.length + 1)

        const gc = await services?.serviceGroupChat.setWelcome(jid!, m1)
        botwa.sendText(jid!, 'sukses /set-welcome\npreview nya nih...')

        const participant = receivedMessage?.participant
        const groupName = await botwa.getGroupSubject(jid!)


        let welcome = gc?.welcome.replace('[member_name]', `@${participant?.split('@')[0]}`)
        welcome = welcome?.replace('[group_name]', groupName)
        botwa.sendMentioned(jid!, welcome!, [participant!])
    }

}