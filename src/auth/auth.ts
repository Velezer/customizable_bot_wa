import { addTransactionCapability, LegacyAuthenticationCreds } from "@adiwajshing/baileys";
import fs from 'fs'

export function saveAuth(data: Partial<LegacyAuthenticationCreds>) {
    fs.writeFileSync('auth.json', JSON.stringify(data)) 
}

export function loadAuth(): LegacyAuthenticationCreds {
    const rawData = fs.readFileSync('auth.json')
    const data = JSON.parse(rawData.toString())
    return data
}