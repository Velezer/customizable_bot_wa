import { Command, CommandLevel } from "../Command/Command";
import { allCommands } from "../Command/regular.command";
import { BotLevel, GroupMenu } from "./interface";

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
    groupMenu: GroupMenu[] = []
    trial: boolean = false
    botLevel: BotLevel = BotLevel.BASIC

    constructor(jidGroup: string) {
        this.jid = jidGroup
        this.commandKeys = fillCommandkeys()
        this.registeredTime = new Date()
    }

    addGroupMenu(key: string, value: string) {
        const command: GroupMenu = { key, value }
        this.groupMenu.push(command)

    }
    updateGroupMenu(key: string, value: string) {
        const found = this.groupMenu.find(c => c.key === key)
        if (found) {
            found.value = value
        }
    }

    removeGroupMenu(key: string) {
        const index = this.groupMenu.findIndex(g => g.key === key)
        if (index > -1) {
            this.groupMenu.splice(index, 1)
        }
    }

    addCommandKey(commandKey: string) {
        this.commandKeys.push(commandKey)
    }

    removeCommandkey(commandKey: string) {
        const index = this.commandKeys.indexOf(commandKey)
        if (index > -1) {
            this.commandKeys.splice(index, 1)
        }
    }

    getRegisteredTime() {
        return this.registeredTime = new Date(this.registeredTime)
    }

    isExpired(): boolean {
        const registeredTime = this.getRegisteredTime()
        const expired30Days = new Date(registeredTime)
        expired30Days.setDate(registeredTime.getDate() + 30)

        return new Date() > expired30Days
    }

    isTrialExpired(): boolean {
        const registeredTime = this.getRegisteredTime()
        const expired2Days = new Date(registeredTime)
        expired2Days.setDate(registeredTime.getDate() + 1)

        return new Date() > expired2Days
    }

    expiredAt(): string {
        const registeredTime = this.getRegisteredTime()
        const expired30Days = new Date(registeredTime)
        expired30Days.setDate(registeredTime.getDate() + 30)

        return expired30Days.toLocaleString('id-ID', { month: 'long', year: 'numeric', day: 'numeric' }) +
            ' jam ' + expired30Days.toLocaleString('id-ID', { hour: 'numeric', minute: 'numeric' })
    }
    trialExpiredAt(): string {
        const registeredTime = this.getRegisteredTime()
        const expired2Days = new Date(registeredTime)
        expired2Days.setDate(registeredTime.getDate() + 1)

        return expired2Days.toLocaleString('id-ID', { month: 'long', year: 'numeric', day: 'numeric' }) +
            ' jam ' + expired2Days.toLocaleString('id-ID', { hour: 'numeric', minute: 'numeric' })
    }

    registeredAt(): string {
        return this.registeredTime.toLocaleString('id-ID', { month: 'long', year: 'numeric', day: 'numeric' }) +
            ' jam ' + this.registeredTime.toLocaleString('id-ID', { hour: 'numeric', minute: 'numeric' })

    }
}
