import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import userRoutes from './handlers/user'
import productRoutes from './handlers/product'
import orderRoutes from './handlers/order'
import productServicesRoutes from './handlers/prodcutsServices'
import dotenv from 'dotenv'

dotenv.config()


const app: express.Application = express()
const port = process.env.SERVER_PORT

app.use(bodyParser.json())

userRoutes(app)
productRoutes(app)
orderRoutes(app)
productServicesRoutes(app)

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

app.listen(port, function () {
    console.log(`starting app on: ${port}`)
})

export default app
