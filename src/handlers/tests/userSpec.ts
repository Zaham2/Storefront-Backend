import supertest from 'supertest'
import app from '../../server'
import { User, UserStore } from '../../models/user'
import client from '../../database'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


const request = supertest(app)

const store = new UserStore()

describe('Testing userHandler endpoints', () => {

    const defaultUser: User = {
        id: 1,
        firstname: "Mohamad",
        lastname: "Elzahaby",
        password: "123"
    }

    let token = ''
    beforeAll(async () => {
        const newUser =await store.create(defaultUser)
        // @ts-ignore
        token = jwt.sign({user : newUser},process.env.TOKEN_SECRET)
        token = 'Bearer '+token
    })

    afterAll(async () => {
        const sql = 'DELETE FROM users;'
        const conn = await client.connect()
        await conn.query(sql)
        conn.release()
    })

    it('authenticate', async () => {

        const response = await request.post('/users/authenticate/1').send({
            id: 1,
            password: '123'
        })
        expect(response.status).toBe(200)
    })

    it('index', async ()=>{
        const response = await request.get('/users').set('Authorization',token)
        expect(response.status).toBe(200)
    })  

    it('show', async ()=>{

        const response = await request.get('/users/1').set('Authorization',token)
        expect(response.status).toBe(200)
    })

    it('create',async ()=>{
        const response = await request.post('/users').send({
            id: 2,
            firstname: 'Mohamad2',
            lastname: 'Elzahaby2',
            password: '123'
        }).set('Authorization',token)
        expect(response.status).toBe(200)
    })

    it('destroy',async ()=>{
        const response = await request.delete('/users/1').set('Authorization',token)
        expect(response.status).toBe(200)
    })

    
})
