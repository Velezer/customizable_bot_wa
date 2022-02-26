import fs from 'fs'
import { GroupChat } from './Group'


export class GroupManager {

    static filename: string = 'groups.json'

    static getRegisteredGroup(): GroupChat[] {
        if (!fs.existsSync(this.filename)) return []
        const groupsString = fs.readFileSync(this.filename, { encoding: 'utf8' })
        if (!groupsString || groupsString === '') return []
        const groups = JSON.parse(groupsString) as GroupChat[]
        return groups
    }

    static findGroup(jid: string) {
        let groups = this.getRegisteredGroup()
        let found = groups.find(g => g.jid === jid)
        return found
    }


    static register(newGroup: GroupChat, trial: boolean = false): boolean {
        newGroup.trial = trial
        let groups = this.getRegisteredGroup()

        let found = groups.find(g => g.jid === newGroup.jid)
        if (found) {
            found.registeredTime = new Date()
            groups.push(found)
        } else {
            groups.push(newGroup)
        }

        fs.writeFileSync(this.filename, JSON.stringify(groups))

        groups = this.getRegisteredGroup()
        found = groups.find(g => g.jid === newGroup.jid)
        if (found) {
            return true
        }

        throw new Error("gagal registrasi");

    }

    static update(group: GroupChat) {
        let groups = this.getRegisteredGroup()
        let index = groups.findIndex(g => g.jid === group.jid)
        if (index > -1) {
            groups[index] = group
            fs.writeFileSync(this.filename, JSON.stringify(groups))
        }
    }
}