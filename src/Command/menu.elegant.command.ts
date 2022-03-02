import { proto } from "@adiwajshing/baileys";
import { BotWa } from "../BotWa/BotWa";
import { GroupChat } from "../groups/GroupChat";
import { Command, CommandLevel } from "./interface";
import { AddCustomMenuCommand } from "./crud.menu.command";
import { BotLevel } from "../groups/interface";




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