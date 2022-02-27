import { proto, WAParticipantAction } from "@adiwajshing/baileys"
import { BotWa } from "../BotWa/BotWa"


export const StubTypeEnum = proto.WebMessageInfo.WebMessageInfoStubType;
export type StubType = proto.WebMessageInfo.WebMessageInfoStubType;

export abstract class Behavior {
    abstract action: WAParticipantAction

    abstract run(botwa: BotWa, jid: string): Promise<void>
}