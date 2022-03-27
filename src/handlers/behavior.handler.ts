import { WAParticipantAction } from "@adiwajshing/baileys"
import { WelcomeGroupParticipantAddBehavior, LeaveGroupParticipantBehavior, PromoteParticipantBehavior, DemoteParticipantBehavior } from "../behaviors/behaviors";
import { Behavior } from "../behaviors/interface";
import { BotWa } from "../botwa";
import { Services } from "../typeorm/service/interface";
import { Handler } from "./interface";



export class BehaviorHandler implements Handler<Behavior> {
    botwa: BotWa;
    handlers: Behavior[] = [
        new WelcomeGroupParticipantAddBehavior(),
        new LeaveGroupParticipantBehavior(),
        new PromoteParticipantBehavior(),
        new DemoteParticipantBehavior(),
    ]
    services: Services

    constructor(botwa: BotWa, services: Services) {
        this.botwa = botwa
        this.services = services
    }



    run(action: WAParticipantAction, groupJid: string, participant: string) {

        this.handlers.forEach(async behavior => {
            if (behavior.action === action) {
                try {
                    behavior.run(this.botwa, groupJid, participant, this.services)
                } catch (err) {
                    console.log(err)
                }
            }
        })
    }

}