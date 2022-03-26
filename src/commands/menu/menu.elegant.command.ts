import { proto } from "@adiwajshing/baileys";
import { AddCustomMenuCommand } from "./crud.menu.command";
import { BotLevel } from "../../groups/interface";
import { Command, CommandLevel, RunArgs } from "../interface";




export class GroupMenuElegantCommand implements Command {
    botLevel: BotLevel = BotLevel.ELEGANT
    key: string = '/menu';
    description: string = 'nampilin menu';
    example: string = this.key;
    level: CommandLevel = CommandLevel.MEMBER;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, services, botwa, groupChat } = args
        const sections: proto.ISection[] = []

        groupChat!.groupMenu = await services!.serviceGroupMenu.findAllMenu(groupChat!.jid)
        if (groupChat!.groupMenu.length > 0) {
            const menuRows: proto.IRow[] = []
            groupChat!.groupMenu.forEach(m => {
                const row: proto.IRow = { rowId: m.key, title: m.key }
                menuRows.push(row)
            })

            const menuSection: proto.ISection = {
                title: 'Menu',
                rows: menuRows,
            }

            sections.push(menuSection)
            await botwa.sendListMessageSingleSelect(groupChat!.jid, 'Menu', sections);
        } else {

            await botwa.sendMessage(groupChat!.jid, 'menu kosong silakan tambahkan menggunakan\n\n' +
                new AddCustomMenuCommand().example)

        }


    }
}
