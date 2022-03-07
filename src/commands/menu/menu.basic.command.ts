
import { proto } from "@adiwajshing/baileys";
import { BotWa } from "../../botwa";
import { GroupChat } from "../../groups/group.chat";
import { Command, CommandLevel } from "../interface";
import { AddCustomMenuCommand } from "./crud.menu.command";
import { BotLevel } from "../../groups/interface";
import { ImageStorage } from "../../groups/group.image";
import { AddImageMenuCommand } from "./crud.image.command";


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

        if (groupChat.botLevel === BotLevel.ELEGANT) {
            const sections: proto.ISection[] = []

            const commandRows: proto.IRow[] = []
            const filteredCommands = this.allCommands.filter(c => c.botLevel <= groupChat.botLevel)

            const setKeys = new Set(filteredCommands.map(c => c.key))
            setKeys.forEach(key => {
                const c = filteredCommands.find(c => c.key === key)!
                const row: proto.IRow = { rowId: key, title: c.example, description: c.description }
                commandRows.push(row)
            })


            const commandSection: proto.ISection = {
                title: 'Commands',
                rows: commandRows,
            }
            sections.push(commandSection)

            await botwa.sendListMessageSingleSelect(groupChat.jid, 'Commands', sections);

        } else if (groupChat.botLevel === BotLevel.BASIC) {
            let msg = ''

            msg += '_Commands_\n\n'
            const filteredCommands = this.allCommands.filter(c => c.botLevel <= groupChat.botLevel)
            const setKeys = new Set(filteredCommands.map(c => c.key))
            setKeys.forEach(key => {
                const c = filteredCommands.find(c => c.key === key)!
                msg += `${c.example}\n${c.description}\n\n`
            })
            msg = msg.slice(0, -2)
            await botwa.sendMessage(groupChat.jid, msg);
        }

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

            msg += '_Menu_\n\n'
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

export class ImageMenuBasicCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/image';
    description: string = 'nampilin image';
    example: string = this.key;
    level: CommandLevel = CommandLevel.MEMBER;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const groupImageData = ImageStorage.findByGroupJid(groupChat.jid)
        if (groupImageData!.images.length > 0) {
            let msg = ''

            msg += '_Image_\n\n'
            groupImageData!.images.forEach(img => {
                msg += `${img.id}\n\n`
            })
            msg = msg.slice(0, -2)
            await botwa.sendMessage(groupChat.jid, msg);
        } else {

            await botwa.sendMessage(groupChat.jid, 'image kosong silakan tambahkan menggunakan\n\n' + new AddImageMenuCommand().example)

        }


    }
}