type PromiseFunction<T> = () => Promise<T>
/**
 * 
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