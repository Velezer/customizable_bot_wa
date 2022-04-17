import { BotLevel } from "../../groups/interface";
import { Command, CommandLevel, RunArgs } from "../interface";


export class SetLeaveCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/set-leave';
    example: string = this.key + ' left [member_name] from [group_name]';
    description: string = 'set leave message';
    level: CommandLevel = CommandLevel.ADMIN;


    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat, services } = args
        const jid = groupChat?.jid
        let m1 = conversation.slice(this.key.length + 1)

        const gc = await services?.serviceGroupChat.setLeave(jid!, m1)
        botwa.sendText(jid!, 'sukses '+this.key+'\npreview nya nih...')

        const participant = receivedMessage?.participant
        const groupName = await botwa.getGroupSubject(jid!)


        let leave = gc?.leave.replace('[member_name]', `@${participant?.split('@')[0]}`)
        leave = leave?.replace('[group_name]', groupName)
        botwa.sendMentioned(jid!, leave!, [participant!])
    }

}