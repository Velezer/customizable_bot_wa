export type command = {
    key: string,
    replyMessage: string,
    cb: (key: string, replyMessage: string) => void
}


export const commands: command[]
    = [
        {
            key: '/cek',
            replyMessage: 'ente ngecek bos',
            cb: () => { }
        }, {
            key: '/tambahpesan',
            replyMessage: `berhasil menambahkan command`,
            cb: function (key: string, replyMessage: string) {
                commands.push({
                    key: key,
                    replyMessage: replyMessage,
                    cb: () => { }
                })
            }
        },
    ]