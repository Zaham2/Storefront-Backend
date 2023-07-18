import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import verifyAuthToken from './auth'

dotenv.config()

const store = new UserStore()

export const authenticate = async (req: Request, res: Response): Promise<User | null> => {


    const user = {
        id: parseInt(req.params.id),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password
    }
    try {

        const u = await store.authenticate(user.id, user.password)
        if (!u) {
            res.json(`Authentication Failed... Please try again`)
            return null
        }
        // @ts-ignore
        let token = jwt.sign({ user: u }, process.env.TOKEN_SECRET)
        res.json(token)
        return u
    }
    catch (err) {
        res.status(401)
        res.json(err)
        return null
    }
}

const index = async (req: Request, res: Response) => {
    try {
        const users = await store.index()
        if (users) {
            res.json(users)
            return users
        } else {
            res.json("No users to show")
        }
    } catch (err) {
        throw new Error(`${err}`)
    }
}

const show = async (req: Request, res: Response) => {
    try {
        const user = await store.show(parseInt(req.params.id))
        if (user) {
            res.json(user)
        } else {
            res.json("This user does not exist")
        }
    } catch (err) {
        throw new Error(`${err}`)
    }
}

const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await store.delete(parseInt(req.params.id))
        if (deleted) {
            res.json(`deleted user: ${deleted.id}`)
        } else {
            res.json("Could not delete this user")
        }
    } catch (err) {
        throw new Error(`${err}`)
    }
}

const create = async (req: Request, res: Response) => {
    try {

        let user: User = {
            id: req.body.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password
        }
        const newUser = await store.create(user)

        // @ts-ignore
        let token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET)
        res.json(token)
        return token
    } catch (err) {
        res.status(400)
        res.json(`Could not create user: ${err}`)
    }
}

const userRoutes = (app: express.Application) => {
    app.post('/users/authenticate/:id', authenticate)
    app.post('/users', create)
    app.get('/users', verifyAuthToken, index)
    app.get('/users/:id', verifyAuthToken, show)
    app.delete('/users/:id', verifyAuthToken, destroy)
}

export default userRoutes