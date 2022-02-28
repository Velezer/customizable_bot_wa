import { WAParticipantAction } from "@adiwajshing/baileys"
import { Behavior } from "../Behavior/Behavior"
import { WelcomeGroupParticipantAddBehavior, LeaveGroupParticipantBehavior, PromoteParticipantBehavior, DemoteParticipantBehavior } from "../Behavior/behaviors"
import { BotWa } from "../BotWa/BotWa";
import { UpdateHandler } from "./interface";



export class Behaviorer implements UpdateHandler<Behavior> {
    botwa: BotWa;
    handlers: Behavior[] = [
        new WelcomeGroupParticipantAddBehavior(),
        new LeaveGroupParticipantBehavior(),
        new PromoteParticipantBehavior(),
        new DemoteParticipantBehavior(),
    ]

    constructor(botwa: BotWa) {
        this.botwa = botwa
    }



    run(action: WAParticipantAction, jid: string) {

        this.handlers.forEach(async behavior => {
            if (behavior.action === action) {
                behavior.run(this.botwa, jid)
            }
        })
    }

}