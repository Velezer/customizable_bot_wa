type PromiseFunction<T> = () => Promise<T>
/**
 * it doesn't support reject
 * @param fn Function must return promise
 * @param seconds interval to run fn
 */
export function retryPromise<T>(fn: PromiseFunction<T>, seconds: number): Promise<T> {
    return new Promise(resolve => {
        fn()
            .then(resolve)
            .catch(() => {
                setTimeout(() => {
                    retryPromise(fn, seconds)
                }, seconds * 1000)
            });

    });
}

export async function sleep(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}