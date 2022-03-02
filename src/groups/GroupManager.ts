import { Helper } from '../helper/file'
import { GroupChat } from './GroupChat'


export class GroupManager {

    static filename: string = 'groups.json'

    private static writeFile(data: GroupChat[]) {
        Helper.saveJSON(this.filename, data)
    }

    static getRegisteredGroup(): GroupChat[] {
        if (!Helper.isExist(this.filename)) return []
        const groupsString = Helper.readFile(this.filename)
        if (!groupsString || groupsString === '') return []
        const groups = JSON.parse(groupsString) as GroupChat[]
        return groups
    }

    static findGroup(jid: string) {
        let groups = this.getRegisteredGroup()
        let found = groups.find(g => g.jid === jid)
        return found
    }

    static remove(jid: string) {
        let groups = this.getRegisteredGroup()
        const index = groups.findIndex(g => g.jid === jid)
        if (index > -1) {
            groups.splice(index, 1)
            this.writeFile(groups)
        }

        if (this.getRegisteredGroup().find(g => g.jid === jid)) return false
        else return true
    }


    static register(newGroup: GroupChat, trial: boolean): boolean {
        newGroup.trial = trial
        let groups = this.getRegisteredGroup()

        let found = groups.find(g => g.jid === newGroup.jid)
        if (found) {
            found.trial = trial
            found.registeredTime = new Date()
            groups.push(found)
        } else {
            groups.push(newGroup)
        }

        this.writeFile(groups)

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
            this.writeFile(groups)
        }
    }
}