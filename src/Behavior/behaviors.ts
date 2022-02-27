import { WAParticipantAction } from "@adiwajshing/baileys";
import { BotWa } from "../BotWa/BotWa";
import { Behavior, StubType, StubTypeEnum } from "./Behavior";


export class WelcomeGroupParticipantAddBehavior extends Behavior {
    action: WAParticipantAction = 'add'

    async run(botwa: BotWa, to: string): Promise<void> {
        await botwa.sendMessage(to, 'welcome participant')
    }
}


export class LeaveGroupParticipantBehavior extends Behavior {
    action: WAParticipantAction = 'remove'

    async run(botwa: BotWa, to: string): Promise<void> {
        await botwa.sendMessage(to, 'beban sana wus wus!')
    }

}
export class PromoteParticipantBehavior extends Behavior {
    action: WAParticipantAction = 'promote'

    async run(botwa: BotWa, to: string): Promise<void> {
        await botwa.sendMessage(to, 'promote')
    }

}
export class DemoteParticipantBehavior extends Behavior {
    action: WAParticipantAction = 'demote'

    async run(botwa: BotWa, to: string): Promise<void> {
        await botwa.sendMessage(to, 'demote')
    }

}