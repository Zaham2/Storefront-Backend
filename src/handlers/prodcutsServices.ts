import express, { Request, Response } from 'express'
import { ProductServices } from '../services/productServices'

const productServices = new ProductServices()

const getTopFiveProducts = async (req: Request, res: Response) => {
    try{
    const topFive = await productServices.getTopFiveProducts()
    res.json(topFive)
    return topFive
} catch(err){
    throw new Error(`${err}`)
}
}

const productServicesRoutes = (app: express.Application) => {
    app.get('/productsServices/top5',getTopFiveProducts)
}

export default productServicesRoutes