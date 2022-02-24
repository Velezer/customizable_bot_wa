import { Command, allCommands, CommandLevel } from "../Command/Command";



export class GroupChat {
    jid: string
    commandKeys: string[]

    constructor(jidGroup: string) {
        this.jid = jidGroup
        this.commandKeys = allCommands.map(c => {
            if (c.level === CommandLevel.ADMIN || c.level === CommandLevel.MEMBER) return c.key
            return ''
        })
    }

    addCommandKey(commandKey: string) {
        this.commandKeys.push(commandKey)
    }

    removeCommandkey(commandKey: string) {
        const index = this.commandKeys.indexOf(commandKey)
        if (index) {
            this.commandKeys.splice(index, 1)
        }
    }
}