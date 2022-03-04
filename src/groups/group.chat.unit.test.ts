import { GroupChat } from "./group.chat"

describe('GroupChat', () => {
    let group: GroupChat

    beforeEach(() => {
        group = new GroupChat('jid')
    })

    it('trial expired', () => {
        group.registeredTime.setDate(group.registeredTime.getDate() - 2)
        expect(group.isTrialExpired()).toBe(true)
    })

    it('sewa expired', () => {
        group.registeredTime.setDate(group.registeredTime.getDate() - 31)
        expect(group.isExpired()).toBe(true)
    })
})