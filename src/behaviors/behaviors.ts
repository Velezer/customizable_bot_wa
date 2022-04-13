import { WAParticipantAction } from "@adiwajshing/baileys";
import { BotWa } from "../botwa";
import { GroupGreetingCard } from "../images/group-greeting.card";
import { Services } from "../typeorm/service/interface";
import { Behavior } from "./interface";


export class WelcomeGroupParticipantAddBehavior implements Behavior {
    action: WAParticipantAction = 'add'

    async run(botwa: BotWa, to: string, participant: string, services: Services): Promise<void> {
        
        const gc = await services.serviceGroupChat.findOneByJid(to)
        const groupName = await botwa.getGroupSubject(to)
        let welcome =  gc?.welcome
        if (!welcome) welcome = 'welcome [member_name] di [group_name]'
        welcome = welcome?.replace('[member_name]', `@${participant?.split('@')[0]}`)
        welcome = welcome?.replace('[group_name]', groupName)

        const text = welcome!

        const card = new GroupGreetingCard('welcome')
        try {
            await botwa.getProfilePictureBuffer(to).then(gicon=>card.addGroupIcon(gicon))
            await botwa.getProfilePictureBuffer(participant).then(pp=>card.addPP(pp))
        } catch (err) {
        } finally{
            const cardBuffer = await card.getBufferAsync()
            const preparedImageMessage = await botwa.prepareImageMessage(cardBuffer)
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


        const card = new GroupGreetingCard('leave')
        try {
            await botwa.getProfilePictureBuffer(to).then(gicon=>card.addGroupIcon(gicon))
            await botwa.getProfilePictureBuffer(participant).then(pp=>card.addPP(pp))
        } catch (err) {
        } finally{
            const cardBuffer = await card.getBufferAsync()
            const preparedImageMessage = await botwa.prepareImageMessage(cardBuffer)
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