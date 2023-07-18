import client from '../database'
import bcrypt, { hashSync } from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

export type User = {
    id: Number,
    firstname: string,
    lastname: string,
    password: string
}

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const sql = 'SELECT * FROM users;'
            const conn = await client.connect()
            const result = await conn.query(sql)
            conn.release()
            // console.log(result.rows)
            return result.rows
        }
        catch (err) {
            throw new Error(`Cannot get users ${err}`)
        }

    }

    async show(id: number): Promise<User> {
        try {
            // console.log(id)
            const conn = await client.connect()
            const sql = `SELECT * FROM users WHERE id = ${id}`
            const result = await conn.query(sql)
            conn.release()
            // console.log(result.rows[0])
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot get user ${id}:  ${err}`)
        }
    }

    // we need to hash password with salt and pepper
    async create(user: User): Promise<User> {
        try {
            // @ts-ignore
            const saltRounds = parseInt(process.env.SALT_ROUNDS)
            const pepper = process.env.PEPPER
            const hashedPassword = hashSync(user.password + pepper, saltRounds)
            const sql = `INSERT INTO users (id, firstname, lastname, password) VALUES (${user.id},'${user.firstname}', '${user.lastname}', '${hashedPassword}') RETURNING *;`
            const conn = await client.connect();
            const result = await conn.query(sql)
            conn.release();

            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot create user: ${err}`)
        }
    }

    async authenticate(id: number, password: string): Promise<User | null> {
        try {
            const conn = await client.connect()
            const sql = `SELECT * FROM users WHERE id = ${id};`
            const result = await conn.query(sql)

            if (result.rows.length) {
                const user = result.rows[0]
                if (bcrypt.compareSync(password + process.env.PEPPER, user.password)) {
                    // console.log('user returned successfully')
                    return user
                } else {
                    // console.log('returning null 1')
                    return null
                }
            }
            // console.log('returning null 2')
            return null
        } catch (err) {
            throw new Error('error '+err)
        }
    }

    async delete(id: number): Promise<User> {

        try {
            const sql = `DELETE FROM users WHERE id=${id} RETURNING *;`
            const conn = await client.connect()
            const result = await conn.query(sql)
            conn.release();
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not delete User: ${id}`)
        }
    }
}