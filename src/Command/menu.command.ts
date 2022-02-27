import { proto } from "@adiwajshing/baileys";
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

        const commandRows: proto.IRow[] = []
        this.allCommands.forEach(command => {
            if (groupChat.commandKeys.includes(command.key)) {
                const row: proto.IRow = { rowId: command.key, title: command.example, description: command.description }
                commandRows.push(row)
            }
        })

        const menuRows: proto.IRow[] = []
        if (groupChat.groupCommands.length > 0) {
            groupChat.groupCommands.forEach(command => {
                const row: proto.IRow = { rowId: command.key, title: command.key }
                menuRows.push(row)
            })
        }

        const commandSection: proto.ISection = {
            title: 'Commands',
            rows: commandRows,
        }
        const menuSection: proto.ISection = {
            title: 'Menu',
            rows: menuRows,
        }

        const sections: proto.ISection[] = [commandSection, menuSection]

        await botwa.sendListMessage(groupChat.jid, sections);

    }
}