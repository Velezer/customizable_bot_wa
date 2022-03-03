import { WAParticipantAction } from "@adiwajshing/baileys";
import { BotWa } from "../BotWa/BotWa";
import { Card } from "../images/card";
import { Behavior } from "./Behavior";


export class WelcomeGroupParticipantAddBehavior implements Behavior {
    action: WAParticipantAction = 'add'

    async run(botwa: BotWa, to: string, participantJid: string): Promise<void> {
        const number = participantJid.split('@')[0]
        const text = 'welcome @' + number

        try {
            const ppImg = await botwa.getProfilePictureBuffer(participantJid)

            const card = new Card('./src/images/OcedBot-welcome.jpg', ppImg)
            const cardBuffer = await card.make()
            const preparedImageMessage = await botwa.prepareImageMessage(cardBuffer)

            await botwa.sendButtonMessage(to, text, preparedImageMessage.message?.imageMessage!, ['/menu'], [participantJid])

        } catch (err) {
            console.log(err)
            await botwa.sendMentioned(to, text, [participantJid])
        }
    }
}


export class LeaveGroupParticipantBehavior implements Behavior {
    action: WAParticipantAction = 'remove'

    async run(botwa: BotWa, to: string, participantJid: string): Promise<void> {
        const number = participantJid.split('@')[0]

        const text = 'beban sana wus wus! @' + number

        try {
            const ppImg = await botwa.getProfilePictureBuffer(participantJid)

            const card = new Card('./src/images/OcedBot-leave.jpg', ppImg)
            const cardBuffer = await card.make()
            const imageMessage = (await botwa.prepareImageMessage(cardBuffer)).message?.imageMessage

            await botwa.sendButtonMessage(to, text, imageMessage!, [], [participantJid])

        } catch (err) {
            console.log(err)
            await botwa.sendMentioned(to, text, [participantJid])
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