/**
 * it doesn't support reject
 * @param fn Function must return promise
 * @param seconds interval to run fn
 */
export function retryPromise<T>(fn: () => Promise<T>, seconds: number): Promise<T> {
    return new Promise(resolve => {
        fn()
            .then(resolve)
            .catch(() => {
                setTimeout(() => {
                    retryPromise(fn, seconds)
                }, seconds * 1000)
            })
    })
}

export async function sleep(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

export function getRandomString(length: number) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var result = ''
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
    }
    return result
}

export function futureDateFromNow(day: number) {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + day)
    return futureDate
}