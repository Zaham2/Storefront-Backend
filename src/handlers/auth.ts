import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import jwt, { decode } from 'jsonwebtoken'

dotenv.config()


// This method is implicitly tested for all test routes that use it as middleware 
const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {

        // @ts-ignore
        const token_secret:string = process.env.TOKEN_SECRET

        const authorizationHeader = req.headers.authorization

        // @ts-ignore
        const token = authorizationHeader.split(' ')[1]

        const decoded = jwt.verify(token, token_secret)

        next()
        return token
    } catch (error) {
        res.status(401)
        res.json(`Access denied: Invalid token
        ${error}`)
        return null
        // return
    }
}

export default verifyAuthToken

