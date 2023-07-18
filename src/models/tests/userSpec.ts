import { User, UserStore } from "../user";
import client from "../../database";
import { Connection } from "pg";
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const store = new UserStore()

describe("User Model", () => {
    it("testing authenticate method", () => {
        expect(store.authenticate).toBeDefined()
    });

    it("testing index method", () => {
        expect(store.index).toBeDefined()
    });

    it("testing create method", () => {
        expect(store.create).toBeDefined()
    });

    it("testing show method", () => {
        expect(store.show).toBeDefined()
    });

    it("testing delete method", () => {
        expect(store.delete).toBeDefined()
    });
})

describe('User Model functionality\n', () => {
    let defaultUser: User = {
        id: 1,
        firstname: "Mohamad",
        lastname: "Elzahaby",
        password: '123'
    }

    beforeAll(async () => {
        defaultUser = await store.create(defaultUser)
    })

    afterAll(async () => {
        const sql = 'DELETE FROM users;'
        const conn = await client.connect()
        await conn.query(sql)
        conn.release()
    })


    it('create', async () => {
        const user: User = {
            id: 2,
            firstname: 'Mohamad2',
            lastname: 'Elzahaby2',
            password: '123'
        }
        const createdUser = await store.create(user)
        expect(createdUser).toEqual({
            id: 2,
            firstname: 'Mohamad2',
            lastname: 'Elzahaby2',
            password: createdUser.password
        })
    })

    it('index', async () => {
        const users = await store.index()
        expect(users.length).toBe(2)
    })

    it('authenticate', async () => {
        let authenticatedUser = await store.authenticate(defaultUser.id as number, '123')
        expect(authenticatedUser?.id).toBe(defaultUser.id)
        expect(authenticatedUser?.firstname).toBe(defaultUser.firstname)
        expect(authenticatedUser?.lastname).toBe(defaultUser.lastname)
        expect(authenticatedUser?.password).toBe(defaultUser.password)

    })

    it('show',async ()=>{
        const user = await store.show(1)
        expect(user.id).toBe(1)
    })

    it('delete',async ()=>{
        const deleted = await store.delete(1)
        expect(deleted.id).toBe(1)
    })
})