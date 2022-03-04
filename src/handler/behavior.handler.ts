import { WAParticipantAction } from "@adiwajshing/baileys"
import { Behavior } from "../behavior/interface"
import { WelcomeGroupParticipantAddBehavior, LeaveGroupParticipantBehavior, PromoteParticipantBehavior, DemoteParticipantBehavior } from "../behavior/behaviors"
import { BotWa } from "../botwa/botwa";
import { Handler } from "./interface";



export class BehaviorHandler implements Handler<Behavior> {
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



    run(action: WAParticipantAction, groupJid: string, participantJid: string) {

        this.handlers.forEach(async behavior => {
            if (behavior.action === action) {
                try {
                    behavior.run(this.botwa, groupJid, participantJid)
                } catch (err) {
                    console.log(err)
                }
            }
        })
    }

}