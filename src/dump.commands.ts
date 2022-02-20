// import { Message, Whatsapp } from 'venom-bot';

// export type command = {
//     key: string,
//     replyMessage: string,
//     cb: (client: Whatsapp, message: Message) => Promise<boolean>
// }


// export const commands: command[]
//     = [
//         {
//             key: '/cek',
//             replyMessage: 'bot sudah aktif',
//             cb: async () => true
//         }, {
//             key: '/tambah-command',
//             replyMessage: `berhasil menambahkan command`,
//             cb: async (client: Whatsapp, message: Message) => {
//                 const m0 = message.body.split(' ')[0]
//                 const m1 = message.body.split(' ')[1]
//                 const m2 = message.body.split(`${m0} ${m1} `)[1]
//                 commands.push({
//                     key: m1,
//                     replyMessage: m2,
//                     cb: async () => true
//                 })
//                 return true
//             }
//         }, {
//             key: '/tag-all',
//             replyMessage: `tag semua nih`,
//             cb: async function (client: Whatsapp, message: Message) {
//                 if (message.isGroupMsg) {
//                     const groupId = message.chatId
//                     const groupMembers = await client.getGroupMembersIds(groupId)
//                     client.sendMentioned(groupId, '', groupMembers.map(member => member.id))
//                     return true
//                 } else {
//                     client.reply(message.chatId, `${this.key} cuma bisa di grup`, message.id)
//                     return false
//                 }

//             }
//         }, {
//             key: '/masuk-grup',
//             replyMessage: `masuk grup`,
//             cb: async (client: Whatsapp, message: Message) => {
//                 const m1 = message.body.split(' ')[1]
//                 if (await client.joinGroup(m1)) return true
//                 return false
//             }

//         },
//     ]