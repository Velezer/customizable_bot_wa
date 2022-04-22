import { proto, ParticipantAction } from "@adiwajshing/baileys"
import { BotWa } from "../botwa"
import { Services } from "../typeorm/service/interface";


export const StubTypeEnum = proto.WebMessageInfo.WebMessageInfoStubType;
export type StubType = proto.WebMessageInfo.WebMessageInfoStubType;

export interface Behavior {
    action: ParticipantAction

    run(botwa: BotWa, groupJid: string, participant: string, services?: Services): Promise<void>
}