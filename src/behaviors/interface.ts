import { ParticipantAction } from "@adiwajshing/baileys"
import { BotWa } from "../botwa"
import { Services } from "../typeorm/service/interface";


export interface Behavior {
    action: ParticipantAction

    run(botwa: BotWa, groupJid: string, participant: string, services?: Services): Promise<void>
}