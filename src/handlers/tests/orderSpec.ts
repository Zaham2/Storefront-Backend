import supertest from 'supertest'
import app from '../../server'
import { User, UserStore } from '../../models/user'
import { Product, ProductStore } from '../../models/product'
import { Order, OrderStore } from '../../models/order'
import client from '../../database'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { orderproductStore } from '../../models/orderproduct'

dotenv.config()

const request = supertest(app)

const userStore = new UserStore()
const productStore = new ProductStore()
const orderStore = new OrderStore()
const opStore = new orderproductStore()

describe('testing Order endpoints', () => {
    const defaultUser3: User = {
        id: 3,
        firstname: "mohamad3",
        lastname: 'elzahaby3',
        password: '123'
    }

    const defaultProduct4: Product = {
        id: 4,
        name: 'product4',
        price: 40,
        category: 'stuff'
    }

    const defaultProduct5: Product = {
        id: 5,
        name: 'product 5',
        price: 50,
        category: 'stuff'
    }

    const defaultOrder1: Order = {
        id: 1,
        user_id: 3,
        ordercomplete: true
    }

    const defaultOrder2: Order = {
        id: 2,
        user_id: 3,
        ordercomplete: false
    }

    let token = ''

    beforeAll(async () => {

        // @ts-ignore
        const TOKEN_SECRET: string = process.env.TOKEN_SECRET

        const newUser = await userStore.create(defaultUser3)
        await productStore.create(defaultProduct4)
        await productStore.create(defaultProduct5)
        await orderStore.create(defaultOrder1)
        await orderStore.create(defaultOrder2)

        token = jwt.sign({user: newUser},TOKEN_SECRET)
        token = 'Bearer '+token
    })
    afterAll(async () => {
        const sql = 'DELETE FROM order_products;DELETE FROM orders;DELETE FROM users;DELETE FROM products;'
        const conn = await client.connect()
        await conn.query(sql)
        conn.release()
    })


    it('create', async () => {
        const response = await request.post('/orders').send({
            id: 3,
            user_id: 3,
            ordercomplete: false
        }).set('Authorization',token)
        expect(response.status).toBe(200)
    })

    it('index',async ()=>{
        const response = await request.get('/orders').set('Authorization',token)
        expect(response.status).toBe(200)
    })

    it('add Product to Order',async ()=>{

        const response = await request.post('/orders/1/products').send({
            id: 1,
            product_id: defaultProduct4.id,
            quantity: 20
        }).set('Authorization',token)
        expect(response.status).toBe(200)
    })

    it('get open orders',async ()=>
    {
        const response = await request.get(`/users/${defaultUser3.id}/orders?openOrCompleted=open`).set('Authorization', token)
        expect(response.status).toBe(200)
    })

    it('get completed orders',async ()=>
    {
        const response = await request.get(`/users/${defaultUser3.id}/orders?openOrCompleted=completed`).set('Authorization', token)
        expect(response.status).toBe(200)
    })
    


    it('destroy',async ()=>{
        const response = await request.delete('/orders/3').set('Authorization',token)
        expect(response.status).toBe(200)
    })



})

