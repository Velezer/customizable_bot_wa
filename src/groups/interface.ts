

export interface GroupMenu {

	key: string
	value: string

}

export enum BotLevel {
	BASIC = 'basic',
	ELEGANT = 'elegant'
}

export interface ImageEntity {
	id: string
	path: string
}

export interface GroupImageData {
	groupJid: string
	images: ImageEntity[]
}