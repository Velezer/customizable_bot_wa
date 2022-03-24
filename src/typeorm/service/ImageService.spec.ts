import { TestDatabase } from '../test/index';
import fs from 'fs'
import path from 'path';

const testDatabase = new TestDatabase()
const { serviceGroupMenu, imageStorageService:storage } = testDatabase.getServices()

beforeAll(async () => {
    await testDatabase.setup()
})

afterAll(async () => {
    await testDatabase.down()
})

describe('image service', () => {
    const buffer: Uint8Array = new Uint8Array([1,2,3,4,5])
    const bufferUpdated: Uint8Array = new Uint8Array([1,2,3,4,5,5,6,6,2])
    it('store image', async () => {
        const ent = await storage.store(buffer)
        expect(ent.id).toBe(1)
        expect(ent.image).toBe(buffer)
    })
    it('found', async () => {
        const found = await storage.findOne(1)
        expect(found!.image).toStrictEqual(Buffer.from(buffer))
    })
    it('update', async () => {
        const found = await storage.updateOne(1, bufferUpdated)
        expect(found!.image).toBe(bufferUpdated)
    })
    it('remove', async () => {
        const found = await storage.removeOne(1)
        expect(found.affected).toBe(1)
    })
})



