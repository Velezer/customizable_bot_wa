import { WAParticipantAction } from "@adiwajshing/baileys";
import { BotWa } from "../BotWa/BotWa";
import { Card } from "../images/card";
import { Behavior } from "./Behavior";


export class WelcomeGroupParticipantAddBehavior implements Behavior {
    action: WAParticipantAction = 'add'

    async run(botwa: BotWa, to: string, participantJid: string): Promise<void> {
        const number = participantJid.split('@')[0]
        await botwa.sendMentioned(to, 'welcome participant @' + number, [participantJid])
    }
}


export class LeaveGroupParticipantBehavior implements Behavior {
    action: WAParticipantAction = 'remove'

    async run(botwa: BotWa, to: string, participantJid: string): Promise<void> {
        const number = participantJid.split('@')[0]
        await botwa.sendMentioned(to, 'beban sana wus wus! @' + number, [participantJid])
    }

}
export class PromoteParticipantBehavior implements Behavior {
    action: WAParticipantAction = 'promote'

    async run(botwa: BotWa, to: string, participantJid: string): Promise<void> {
        const number = participantJid.split('@')[0]
        try {
            const ppImg = await botwa.getProfilePictureBuffer(participantJid)

            const card = new Card('./src/images/OcedBot-welcome.jpg', ppImg)
            const cardBuffer = await card.make()
            const imageMessage = (await botwa.prepareImageMessage(cardBuffer)).message?.imageMessage

            const text = 'promote @' + number
            await botwa.sendButtonMessage(to, text, imageMessage!, ['/menu'], [participantJid])

        } catch (err) {
            console.log('gagal ambil pp')
        }

        await botwa.sendMentioned(to, 'promote @' + number, [participantJid])
    }

}
export class DemoteParticipantBehavior implements Behavior {
    action: WAParticipantAction = 'demote'

    async run(botwa: BotWa, to: string, participantJid: string): Promise<void> {
        const number = participantJid.split('@')[0]


        try {
            const ppImg = await botwa.getProfilePictureBuffer(participantJid)

            const card = new Card('./src/images/OcedBot-leave.jpg', ppImg)
            const cardBuffer = await card.make()
            const imageMessage = (await botwa.prepareImageMessage(cardBuffer)).message?.imageMessage

            const text = 'promote @' + number
            await botwa.sendButtonMessage(to, text, imageMessage!, ['/menu'], [participantJid])
        } catch (err) {
            console.log('gagal ambil pp')
        }

        await botwa.sendMentioned(to, 'demote @' + number, [participantJid])
    }

}