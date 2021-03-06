
import { proto } from "@adiwajshing/baileys";
import { Command, CommandLevel, RunArgs } from "../interface";
import { AddCustomMenuCommand } from "./crud.menu.command";
import { BotLevel } from "../../groups/interface";


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

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, receivedMessage, conversation, botwa, groupChat, services } = args

        if (groupChat!.botLevel === BotLevel.ELEGANT) {
            const sections: proto.ISection[] = []

            const commandRows: proto.IRow[] = []
            const filteredCommands = this.allCommands.filter(c => c.botLevel <= groupChat!.botLevel)

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

            await botwa.sendList(groupChat!.jid, 'Commands', 'silakan dipilih', sections);

        } else if (groupChat!.botLevel === BotLevel.BASIC) {
            let msg = ''

            msg += '_Commands_\n\n'
            const filteredCommands = this.allCommands.filter(c => c.botLevel <= groupChat!.botLevel)
            const setKeys = new Set(filteredCommands.map(c => c.key))
            setKeys.forEach(key => {
                const c = filteredCommands.find(c => c.key === key)!
                msg += `${c.example}\n${c.description}\n\n`
            })
            msg = msg.slice(0, -2)
            await botwa.sendText(groupChat!.jid, msg);
        }

    }
}

export class GroupMenuBasicCommand implements Command {
    botLevel: BotLevel = BotLevel.BASIC
    key: string = '/menu';
    description: string = 'nampilin menu';
    example: string = this.key;
    level: CommandLevel = CommandLevel.MEMBER;

    async run(args: RunArgs): Promise<void> {
        const { quotedMessage, services, conversation, botwa, groupChat } = args
        groupChat!.groupMenu = await services!.serviceGroupMenu.findAllMenu(groupChat!.jid)
        if (groupChat!.groupMenu.length > 0) {
            let msg = ''

            msg += '_Menu_\n\n'
            groupChat!.groupMenu.forEach(m => {
                msg += `${m.key}\n\n`
            })
            msg = msg.slice(0, -2)
            await botwa.sendText(groupChat!.jid, msg);
        } else {

            await botwa.sendText(groupChat!.jid, 'menu kosong silakan tambahkan menggunakan\n\n' + new AddCustomMenuCommand().example)

        }


    }
}
