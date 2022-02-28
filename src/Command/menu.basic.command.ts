
import { proto } from "@adiwajshing/baileys";
import { BotWa } from "../BotWa/BotWa";
import { GroupChat } from "../groups/GroupChat";
import { Command, CommandLevel } from "./interface";
import { AddCustomMenuCommand } from "./crud.menu.command";
import { BotLevel } from "../groups/interface";


export class BotMenuBasicCommand implements Command {
    key: string = '/bot';
    description: string = 'nampilin commands';
    example: string = this.key;
    level: CommandLevel = CommandLevel.ADMIN;
    allCommands: Command[];
    botLevel: BotLevel = BotLevel.BASIC

    constructor(allCommands: Command[]) {
        this.allCommands = allCommands
    }

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const sections: proto.ISection[] = []

        const commandRows: proto.IRow[] = []
        const filteredCommands = this.allCommands.filter(c => c.botLevel <= groupChat.botLevel)
        filteredCommands.forEach(c => {
            const row: proto.IRow = { rowId: c.key, title: c.example, description: c.description }
            commandRows.push(row)
        })
        const commandSection: proto.ISection = {
            title: 'Commands',
            rows: commandRows,
        }
        sections.push(commandSection)

        await botwa.sendListMessageSingleSelect(groupChat.jid, 'Commands', sections);

    }
}

export class GroupMenuBasicCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/menu';
    description: string = 'nampilin menu';
    example: string = this.key;
    level: CommandLevel = CommandLevel.MEMBER;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {

        if (groupChat.groupMenu.length > 0) {
            let msg = ''

            msg += '\n\n_Menu_\n\n'
            groupChat.groupMenu.forEach(m => {
                msg += `${m.key}\n\n`
            })
            msg = msg.slice(0, -2)
            await botwa.sendMessage(groupChat.jid, msg);
        } else {

            await botwa.sendMessage(groupChat.jid, 'menu kosong silakan tambahkan menggunakan\n\n' + new AddCustomMenuCommand().example)

        }


    }
}