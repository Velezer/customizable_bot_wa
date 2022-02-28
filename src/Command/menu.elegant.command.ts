import { proto } from "@adiwajshing/baileys";
import { BotWa } from "../BotWa/BotWa";
import { GroupChat } from "../groups/GroupChat";
import { Command, CommandLevel } from "./interface";
import { AddCustomMenuCommand } from "./crud.menu.command";
import { BotLevel } from "../groups/interface";


// export class BotMenuElegantCommand implements Command {
//     key: string = '/bot';
//     description: string = 'nampilin commands';
//     example: string = this.key;
//     level: CommandLevel = CommandLevel.ADMIN;
//     allCommands: Command[];
//     botLevel: BotLevel = BotLevel.ELEGANT

//     constructor(allCommands: Command[]) {
//         this.allCommands = allCommands
//     }

//     async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
//         const sections: proto.ISection[] = []

//         const commandRows: proto.IRow[] = []
//         const filteredCommands = this.allCommands.filter(c => groupChat.botLevel === c.botLevel || c.botLevel === BotLevel.BASIC)
//         filteredCommands.forEach(c => {
//             const row: proto.IRow = { rowId: c.key, title: c.example, description: c.description }
//             commandRows.push(row)
//         })
//         const commandSection: proto.ISection = {
//             title: 'Commands',
//             rows: commandRows,
//         }
//         sections.push(commandSection)

//         await botwa.sendListMessageSingleSelect(groupChat.jid, 'Commands', sections);

//     }
// }

export class GroupMenuElegantCommand implements Command {
    botLevel: BotLevel = BotLevel.ELEGANT
    key: string = '/menu';
    description: string = 'nampilin menu';
    example: string = this.key;
    level: CommandLevel = CommandLevel.MEMBER;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const sections: proto.ISection[] = []

        if (groupChat.groupMenu.length > 0) {
            const menuRows: proto.IRow[] = []
            groupChat.groupMenu.forEach(m => {
                const row: proto.IRow = { rowId: m.key, title: m.key }
                menuRows.push(row)
            })

            const menuSection: proto.ISection = {
                title: 'Menu',
                rows: menuRows,
            }

            sections.push(menuSection)
            await botwa.sendListMessageSingleSelect(groupChat.jid, 'Menu', sections);
        } else {

            await botwa.sendMessage(groupChat.jid, 'menu kosong silakan tambahkan menggunakan\n\n' + new AddCustomMenuCommand().example)

        }


    }
}