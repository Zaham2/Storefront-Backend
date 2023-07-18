import supertest from "supertest";
import { Product, ProductStore } from "../../models/product";
import { User, UserStore } from "../../models/user";
import app from "../../server";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import client from "../../database";

dotenv.config()

const request = supertest(app)

const productStore = new ProductStore()
const userStore = new UserStore()

describe('Tesing Product handler methods', () => {
    const defaultProduct1: Product = {
        id: 1,
        name: 'product1',
        price: 10,
        category: 'food'
    }

    const defaultProduct2: Product = {
        id: 2,
        name: 'product2',
        price: 20,
        category: 'drink'
    }

    const defaultUser: User = {
        id: 1,
        firstname: 'Mohamad',
        lastname: 'Elzahaby',
        password: '123'
    }

    let token = ''

    beforeAll(async () => {
        await productStore.create(defaultProduct1)
        await productStore.create(defaultProduct2)
        const newUser = await userStore.create(defaultUser)
        // @ts-ignore
        token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET)
        token = 'Bearer ' + token
    })

    afterAll(async () => {
        const sql = 'DELETE FROM users;DELETE FROM products'
        const conn = await client.connect()
        await conn.query(sql)
        conn.release()
    })

    it('index', async () => {
        const response = await request.get('/products')
        expect(response.status).toBe(200)
    })

    it('show by category', async () => {
        const response = await request.get('/products?category=food')
        expect(response.status).toBe(200)
    })

    it('show', async () => {
        const response = await request.get('/products/1')
        expect(response.status).toBe(200)
    })

    it('create', async () => {
        const response = await request.post('/products').send({
            id: 3,
            name: 'product3',
            price: 30,
            category: 'stuff'
        }).set('Authorization', token)
        expect(response.status).toBe(200)
    })

    it('destroy', async () => {
        const response = await request.delete('/products/1').set('Authorization', token)
        expect(response.status).toBe(200)
    })
})

