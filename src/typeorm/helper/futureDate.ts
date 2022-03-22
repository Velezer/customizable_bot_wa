export function futureDateFromNow(day: number) {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + day)
    return futureDate
}