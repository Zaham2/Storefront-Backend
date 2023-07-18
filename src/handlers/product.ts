import express, { NextFunction, Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'
import verifyAuthToken from './auth'

const store = new ProductStore()

const index = async (req: Request, res: Response) => {

    try {
        if (req.query.category) {
            productsByCategory(req, res, req.query.category.toString())
            return
        }
        const products = await store.index()
        if (products) {
            res.json(products)
            return products
        } else {
            res.json("No products to show")
        }
    } catch (err) {
        throw new Error(`${err}`)
    }
}

const show = async (req: Request, res: Response) => {
    try {
        const product = await store.show(parseInt(req.params.id))
        if (product) {
            res.json(product)
            return product
        } else {
            res.json("Product does not exist")
        }
    } catch (err) {
        throw new Error(`${err}`)
    }
}

const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await store.delete(parseInt(req.params.id))
        if (deleted) {
            res.json(`deleted Product ${deleted.id}`)
            return deleted
        } else {
            res.json("This product does not exist. Delete failed")
        }
    } catch (err) {
        throw new Error(`${err}`)
    }
}

const create = async (req: Request, res: Response) => {
    try {
        let product: Product = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        }
        const newProduct = await store.create(product)
        res.json(newProduct)
    } catch (err) {
        res.status(401)
        res.json(`Could not create product ${err}`)
    }
}

// http://localhost:3000/products?category=food
const productsByCategory = async (req: Request, res: Response, category: string) => {
    try {
        const productsByCategory = await store.selectByCategory(category)
        if (productsByCategory.length > 0) {
            res.json(productsByCategory)
            return productsByCategory
        } else {
            res.status(404).json("Could not show products by this category")
        }
    } catch (err) {
        throw new Error(`${err}`)
    }
}

const productRoutes = (app: express.Application) => {
    app.get('/products/:id', show)
    app.get('/products', index)  //add query strings for filters
    app.post('/products', verifyAuthToken, create)
    app.delete('/products/:id', verifyAuthToken, destroy)
}

export default productRoutes


