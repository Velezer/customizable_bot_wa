import { Command, allCommands, CommandLevel } from "../Command/Command";
import { GroupCommand } from "./GroupCommand";

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
    registeredTime: Date
    groupCommands: GroupCommand[] = []

    constructor(jidGroup: string) {
        this.jid = jidGroup
        this.commandKeys = fillCommandkeys()
        this.registeredTime = new Date()
    }

    addGroupCommand(key: string, value: string) {
        this.groupCommands.push({ key, value })

    }

    removeGroupCommand(key: string) {
        const index = this.groupCommands.findIndex(g => g.key === key)
        if (index) {
            this.groupCommands.splice(index, 1)
        }
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

    getRegisteredTime() {
        return this.registeredTime = new Date(this.registeredTime)
    }

    isExpired(): boolean {
        const expired30Days = new Date()
        const registeredTime = this.getRegisteredTime()
        expired30Days.setDate(registeredTime.getDate() + 30)

        return new Date() > expired30Days
    }

    expiredAt(): string {
        const expired30Days = new Date()
        const registeredTime = this.getRegisteredTime()
        expired30Days.setDate(registeredTime.getDate() + 30)

        return expired30Days.toLocaleString('id-ID', { month: 'long', year: 'numeric', day: 'numeric' }) +
            ' jam ' + this.registeredTime.toLocaleString('id-ID', { hour: 'numeric', minute: 'numeric' })
    }

    registeredAt(): string {
        return this.registeredTime.toLocaleString('id-ID', { month: 'long', year: 'numeric', day: 'numeric' }) +
            ' jam ' + this.registeredTime.toLocaleString('id-ID', { hour: 'numeric', minute: 'numeric' })

    }
}
