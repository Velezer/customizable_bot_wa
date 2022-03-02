import { proto, WAParticipantAction } from "@adiwajshing/baileys"
import { BotWa } from "../BotWa/BotWa"


export const StubTypeEnum = proto.WebMessageInfo.WebMessageInfoStubType;
export type StubType = proto.WebMessageInfo.WebMessageInfoStubType;

export interface Behavior {
    action: WAParticipantAction

    run(botwa: BotWa, groupJid: string, participantJid: string): Promise<void>
}