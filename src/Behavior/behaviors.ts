import { BotWa } from "../BotWa/BotWa";
import { Behavior, StubType, StubTypeEnum } from "./Behavior";


export class WelcomeGroupParticipantAddBehavior extends Behavior {
    stubType: StubType = StubTypeEnum.GROUP_PARTICIPANT_ADD;

    async cb(botwa: BotWa, to: string, receivedStubType: StubType): Promise<void> {
        if (this.stubType === receivedStubType) {

            await botwa.sendMessage(to, 'welcome participant add')
        }
    }
}

export class WelcomeGroupParticipantInviteBehavior extends Behavior {
    stubType: StubType = StubTypeEnum.GROUP_PARTICIPANT_INVITE;

    async cb(botwa: BotWa, to: string, receivedStubType: StubType): Promise<void> {
        if (this.stubType === receivedStubType) {

            await botwa.sendMessage(to, 'welcome participant invite')
        }
    }

}
export class LeaveGroupParticipantBehavior extends Behavior {
    stubType: StubType = StubTypeEnum.GROUP_PARTICIPANT_LEAVE;

    async cb(botwa: BotWa, to: string, receivedStubType: StubType): Promise<void> {
        if (this.stubType === receivedStubType) {

            await botwa.sendMessage(to, 'beban sana wus wus!')
        }
    }

}