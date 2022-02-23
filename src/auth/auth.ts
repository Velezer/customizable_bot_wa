import fs from 'fs'

export function saveAuth(file: string, data: any) {
    fs.writeFileSync(file, JSON.stringify(data, null, '\t'))
}

// export function loadAuth(file: string) {
//     const rawData = fs.readFileSync(file)
//     const data = JSON.parse(rawData.toString())
//     return data
// }