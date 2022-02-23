import { BotWa } from "../BotWa/BotWa";
import { Behavior, StubType, StubTypeEnum } from "./Behavior";


export class WelcomeGroupParticipantAddBehavior extends Behavior {
    stubType: StubType = StubTypeEnum.GROUP_PARTICIPANT_ADD;

    async run(botwa: BotWa, to: string): Promise<void> {
        await botwa.sendMessage(to, 'welcome participant')
    }
}

export class WelcomeGroupParticipantInviteBehavior extends Behavior {
    stubType: StubType = StubTypeEnum.GROUP_PARTICIPANT_INVITE;

    async run(botwa: BotWa, to: string): Promise<void> {
        await botwa.sendMessage(to, 'welcome participant dapet link grup dari mana?')
    }

}
export class LeaveGroupParticipantBehavior extends Behavior {
    stubType: StubType = StubTypeEnum.GROUP_PARTICIPANT_LEAVE;

    async run(botwa: BotWa, to: string): Promise<void> {
        await botwa.sendMessage(to, 'beban sana wus wus!')
    }

}