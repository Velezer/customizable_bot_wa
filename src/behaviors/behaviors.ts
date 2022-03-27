import { WAParticipantAction } from "@adiwajshing/baileys";
import { BotWa } from "../botwa";
import { Card } from "../images/card";
import { AppDatabase } from "../typeorm";
import { Services } from "../typeorm/service/interface";
import { Behavior } from "./interface";


export class WelcomeGroupParticipantAddBehavior implements Behavior {
    action: WAParticipantAction = 'add'

    async run(botwa: BotWa, to: string, participant: string, services: Services): Promise<void> {
        
        const gc = await services.serviceGroupChat.findOneByJid(to)
        const groupName = await botwa.getGroupSubject(to)
        let welcome =  gc?.welcome.replace('[member_name]', `@${participant?.split('@')[0]}`)
        welcome = welcome?.replace('[group_name]', groupName)

        const text = welcome!

        try {
            const ppImg = await botwa.getProfilePictureBuffer(participant)

            const card = new Card('./storage/group-action-cards/OcedBot-welcome.jpg')
            const cardBuffer = await card.make(ppImg)
            const preparedImageMessage = await botwa.prepareImageMessage(cardBuffer)

            await botwa.sendButtonMessage(to, text, preparedImageMessage.message?.imageMessage!, ['/menu'], [participant])

        } catch (err) {
            console.log(err)
            const defaultCard = await new Card('./storage/group-action-cards/OcedBot-welcome-1.jpg').getBuffer()
            const preparedImageMessage = await botwa.prepareImageMessage(defaultCard)
            await botwa.sendButtonMessage(to, text, preparedImageMessage.message?.imageMessage!, ['/menu'], [participant])
        }
    }
}


export class LeaveGroupParticipantBehavior implements Behavior {
    action: WAParticipantAction = 'remove'

    async run(botwa: BotWa, to: string, participant: string): Promise<void> {
        console.log(participant)
        const number = participant.split('@')[0]

        const text = 'beban sana wus wus! @' + number

        try {
            const ppImg = await botwa.getProfilePictureBuffer(participant)

            const card = new Card('./storage/group-action-cards/OcedBot-leave.jpg')
            const cardBuffer = await card.make(ppImg)
            const preparedImageMessage = await botwa.prepareImageMessage(cardBuffer)

            await botwa.sendButtonMessage(to, text, preparedImageMessage.message?.imageMessage!, ['Yay beban berkurang!!'], [participant])

        } catch (err) {
            console.log(err)
            const defaultCard = await new Card('./storage/group-action-cards/OcedBot-leave-1.jpg').getBuffer()
            const preparedImageMessage = await botwa.prepareImageMessage(defaultCard)
            await botwa.sendButtonMessage(to, text, preparedImageMessage.message?.imageMessage!, ['Yay beban berkurang!!'], [participant])
        }
    }

}
export class PromoteParticipantBehavior implements Behavior {
    action: WAParticipantAction = 'promote'

    async run(botwa: BotWa, to: string, participant: string): Promise<void> {
        const number = participant.split('@')[0]

        await botwa.sendMentioned(to, 'promote @' + number, [participant])

    }

}
export class DemoteParticipantBehavior implements Behavior {
    action: WAParticipantAction = 'demote'

    async run(botwa: BotWa, to: string, participant: string): Promise<void> {
        const number = participant.split('@')[0]



        botwa.sendMentioned(to, 'demote @' + number, [participant])
    }

}