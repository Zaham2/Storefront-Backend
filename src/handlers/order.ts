import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'
import verifyAuthToken from './auth'

const store = new OrderStore()

const index = async (req: Request, res: Response) => {
    try {
        const orders = await store.index()
        res.json(orders)
        return orders
    } catch (err) {
        throw new Error(`${err}`)
    }
}

const create = async (req: Request, res: Response) => {
    try {
        const order: Order = {
            id: req.body.id,
            user_id: req.body.user_id,
            ordercomplete: req.body.ordercomplete
        }
        const newOrder = await store.create(order)
        res.json(newOrder)
        return newOrder
    } catch (err) {
        res.status(400)
        res.json(`Could not create Order: ${err}`)
    }
}

const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await store.delete(parseInt(req.params.id))
        res.json(`Deleted Order ${deleted.id}`)
        return deleted
    } catch (err) {
        throw new Error(`${err}`)
    }
}

const addProduct = async (req: Request, res: Response) => {
    const order_product_id = req.body.id
    const order_id = parseInt(req.params.id)
    const product_id = req.body.product_id
    const quantity = req.body.quantity

    try {
        const addedProduct = await store.addProduct(order_product_id, order_id, product_id, quantity)
        res.json(addedProduct)
        return addedProduct
    } catch (err) {
        // console.log('failed '+err)
        res.status(400)
        res.json(err)
    }
}

const selectOpenOrCompletedOrders = (req: Request, res: Response) => {
    try {
        let query = req.query.openOrCompleted
        if (query) {
            if (query === 'open') {
                openOrders(req, res)
            } else if (query === 'completed') {
                completedOrders(req, res)
            } else {
                res.status(400)
                // console.log(query)
                res.json("Invalid Query String... Please enter either 'open' or 'completed'")
            }
        } else {
            res.json(`Must add query string openOrClosed= 'open' or 'completed' to access order`)
        }
    } catch (err) {
        throw new Error(`${err}`)
    }
}

// 'localhost:3000/users/:id/orders?openOrCompleted=open'
const openOrders = async (req: Request, res: Response) => {
    try {
        const openOrders = await store.currentOrders(parseInt(req.params.id))
        res.json(openOrders)
        return openOrders
    } catch (err) {
        throw new Error(`${err}`)
    }
}

// 'localhost:3000/users/:id/orders?openOrCompleted=completed'
const completedOrders = async (req: Request, res: Response) => {
    try {
        const completedOrders = await store.completedOrders(parseInt(req.params.id))
        res.json(completedOrders)
        return completedOrders
    } catch (err) {
        throw new Error(`${err}`)
    }
}

const orderRoutes = (app: express.Application) => {
    app.post('/orders',verifyAuthToken, create)
    app.post('/orders/:id/products',verifyAuthToken, addProduct)
    app.get('/orders',verifyAuthToken, index)
    app.delete('/orders/:id',verifyAuthToken, destroy)
    app.get('/users/:id/orders', verifyAuthToken, selectOpenOrCompletedOrders)
}

export default orderRoutes