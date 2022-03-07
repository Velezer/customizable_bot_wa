import { proto } from "@adiwajshing/baileys";
import { BotWa } from "../../botwa";
import { GroupChat } from "../../groups/group.chat";
import { Command, CommandLevel } from "../interface";
import { AddCustomMenuCommand } from "./crud.menu.command";
import { BotLevel } from "../../groups/interface";
import { ImageStorage } from "../../groups/group.image.storage";
import { AddImageMenuCommand } from "./crud.image.command";




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

export class ImageMenuElegantCommand implements Command {
    botLevel: BotLevel = BotLevel.ELEGANT
    key: string = '/image';
    description: string = 'nampilin image';
    example: string = this.key;
    level: CommandLevel = CommandLevel.MEMBER;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const sections: proto.ISection[] = []

        const groupImageData = ImageStorage.findByGroupJid(groupChat.jid)
        if (groupImageData!.images.length > 0) {
            const menuRows: proto.IRow[] = []
            groupImageData!.images.forEach(img => {
                const row: proto.IRow = { rowId: img.id, title: img.id }
                menuRows.push(row)
            })

            const menuSection: proto.ISection = {
                title: 'Image',
                rows: menuRows,
            }

            sections.push(menuSection)
            await botwa.sendListMessageSingleSelect(groupChat.jid, 'Image', sections);
        } else {

            await botwa.sendMessage(groupChat.jid, 'image kosong silakan tambahkan menggunakan\n\n' + new AddImageMenuCommand().example)

        }


    }
}