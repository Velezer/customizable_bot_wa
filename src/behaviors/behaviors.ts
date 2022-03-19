import { WAParticipantAction } from "@adiwajshing/baileys";
import { BotWa } from "../botwa";
import { Card } from "../images/card";
import { Behavior } from "./interface";


export class WelcomeGroupParticipantAddBehavior implements Behavior {
    action: WAParticipantAction = 'add'

    async run(botwa: BotWa, to: string, participantJid: string): Promise<void> {
        const number = participantJid.split('@')[0]
        const text = 'welcome @' + number

        try {
            const ppImg = await botwa.getProfilePictureBuffer(participantJid)

            const card = new Card('./storage/group-action-cards/OcedBot-welcome.jpg')
            const cardBuffer = await card.make(ppImg)
            const preparedImageMessage = await botwa.prepareImageMessage(cardBuffer)

            await botwa.sendButtonMessage(to, text, preparedImageMessage.message?.imageMessage!, ['/menu'], [participantJid])

        } catch (err) {
            console.log(err)
            const defaultCard = await new Card('./storage/group-action-cards/OcedBot-welcome-1.jpg').getBuffer()
            const preparedImageMessage = await botwa.prepareImageMessage(defaultCard)
            await botwa.sendButtonMessage(to, text, preparedImageMessage.message?.imageMessage!, ['/menu'], [participantJid])
        }
    }
}


export class LeaveGroupParticipantBehavior implements Behavior {
    action: WAParticipantAction = 'remove'

    async run(botwa: BotWa, to: string, participantJid: string): Promise<void> {
        console.log(participantJid)
        const number = participantJid.split('@')[0]

        const text = 'beban sana wus wus! @' + number

        try {
            const ppImg = await botwa.getProfilePictureBuffer(participantJid)

            const card = new Card('./storage/group-action-cards/OcedBot-leave.jpg')
            const cardBuffer = await card.make(ppImg)
            const preparedImageMessage = await botwa.prepareImageMessage(cardBuffer)

            await botwa.sendButtonMessage(to, text, preparedImageMessage.message?.imageMessage!, ['Yay beban berkurang!!'], [participantJid])

        } catch (err) {
            console.log(err)
            const defaultCard = await new Card('./storage/group-action-cards/OcedBot-leave-1.jpg').getBuffer()
            const preparedImageMessage = await botwa.prepareImageMessage(defaultCard)
            await botwa.sendButtonMessage(to, text, preparedImageMessage.message?.imageMessage!, ['Yay beban berkurang!!'], [participantJid])
        }
    }

}
export class PromoteParticipantBehavior implements Behavior {
    action: WAParticipantAction = 'promote'

    async run(botwa: BotWa, to: string, participantJid: string): Promise<void> {
        const number = participantJid.split('@')[0]

        await botwa.sendMentioned(to, 'promote @' + number, [participantJid])

    }

}
export class DemoteParticipantBehavior implements Behavior {
    action: WAParticipantAction = 'demote'

    async run(botwa: BotWa, to: string, participantJid: string): Promise<void> {
        const number = participantJid.split('@')[0]



        botwa.sendMentioned(to, 'demote @' + number, [participantJid])
    }

}