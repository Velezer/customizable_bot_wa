import { Command, allCommands, CommandLevel } from "../Command/Command";

function fillCommandkeys(): string[] {
    let result: string[] = []
    for (const c of allCommands) {
        if (c.level === CommandLevel.ADMIN || c.level === CommandLevel.MEMBER) {
            result.push(c.key)
        }

    }
    return result
}


export class GroupChat {
    jid: string
    commandKeys: string[]
    // datetime: Date | undefined

    constructor(jidGroup: string) {
        this.jid = jidGroup
        this.commandKeys = fillCommandkeys()
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