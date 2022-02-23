import fs from 'fs'

export function saveAuth(file: string, data: any) {
    fs.writeFileSync(file, JSON.stringify(data, null, '\t'))
}

export function loadAuth() {
    const rawData = fs.readFileSync('auth.json')
    const data = JSON.parse(rawData.toString())
    return data
}