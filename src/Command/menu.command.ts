import { BotWa } from "../BotWa/BotWa";
import { GroupChat } from "../groups/GroupChat";
import { Command, CommandLevel } from "./Command";


export class MenuCommand implements Command {
    key: string = '/menu';
    description: string = 'nampilin menu';
    example: string = this.key;
    level: CommandLevel = CommandLevel.ADMIN;
    allCommands: Command[];

    constructor(allCommands: Command[]) {
        this.allCommands = allCommands
    }


    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {

        // let msg = ''
        // msg += '_Main Menu_\n\n'
        // this.allCommands.forEach(command => {
        //     if (groupChat.commandKeys.includes(command.key)) {
        //         msg += `${command.example} \n${command.description}\n\n`
        //     }
        // })

        // if (groupChat.groupCommands.length > 0) {
        //     msg += '\n\n_Custom Menu_\n\n'
        //     groupChat.groupCommands.forEach(command => {
        //         msg += `${command.key}\n\n`
        //     })
        // }
        // msg = msg.slice(0, -2)

        const commands: string[] = []
        this.allCommands.forEach(command => {
            if (groupChat.commandKeys.includes(command.key)) {
                commands.push(command.example)
            }
        })
        await botwa.sendButtonMessage(groupChat.jid, 'COMMANDS', 'silakan dicoba', commands);

        const menus: string[] = []
        if (groupChat.groupCommands.length > 0) {
            groupChat.groupCommands.forEach(command => {
                menus.push(command.key)
            })
        }
        await botwa.sendButtonMessage(groupChat.jid, 'MENU', 'silakan dicoba', menus);

    }
}