import { proto } from "@adiwajshing/baileys";
import { BotWa } from "../BotWa/BotWa";
import { GroupChat } from "../groups/GroupChat";
import { Command, CommandLevel } from "./Command";
import { CustomMenuCommand } from "./commands";


export class BotMenuCommand implements Command {
    key: string = '/bot';
    description: string = 'nampilin commands';
    example: string = this.key;
    level: CommandLevel = CommandLevel.ADMIN;
    allCommands: Command[];

    constructor(allCommands: Command[]) {
        this.allCommands = allCommands
    }

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const sections: proto.ISection[] = []

        const commandRows: proto.IRow[] = []
        const filteredCommands = this.allCommands.filter(c => groupChat.commandKeys.includes(c.key))
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

export class GroupMenuCommand implements Command {
    key: string = '/menu';
    description: string = 'nampilin menu';
    example: string = this.key;
    level: CommandLevel = CommandLevel.MEMBER;

    async run(botwa: BotWa, groupChat: GroupChat, conversation: string): Promise<void> {
        const sections: proto.ISection[] = []

        if (groupChat.groupCommands.length > 0) {
            const menuRows: proto.IRow[] = []
            groupChat.groupCommands.forEach(command => {
                const row: proto.IRow = { rowId: command.key, title: command.key }
                menuRows.push(row)
            })

            const menuSection: proto.ISection = {
                title: 'Menu',
                rows: menuRows,
            }

            sections.push(menuSection)
            await botwa.sendListMessageSingleSelect(groupChat.jid, 'Menu', sections);
        } else {

            await botwa.sendMessage(groupChat.jid, 'menu kosong silakan tambahkan menggunakan\n\n' + new CustomMenuCommand().example)

        }


    }
}