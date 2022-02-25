import fs from 'fs'
import { GroupChat } from './Group'


export class GroupManager {

    static filename: string = 'groups.json'

    static getRegisteredGroup(): GroupChat[] {
        if (!fs.existsSync(this.filename)) return []
        const groupsString = fs.readFileSync(this.filename, { encoding: 'utf8' })
        if (!groupsString || groupsString === '') return []
        const groups = JSON.parse(groupsString)
        return groups
    }

    static register(jidGroup: string, newGroup: GroupChat): boolean {
        const groups = this.getRegisteredGroup()
        for (const g of groups) {
            if (g.jid === jidGroup) return true
        }

        groups.push(newGroup)
        fs.writeFileSync(this.filename, JSON.stringify(groups))

        for (const g of this.getRegisteredGroup()) {
            if (g.jid === jidGroup) return true
        }
        throw new Error("gagal registrasi");

    }
}